import {
  parseEventLogs,
  type Address,
  type Hash,
  type TransactionReceipt,
} from "viem";
import { publicClient, getWalletClient } from "./viem";
import { scoreSystemAddress } from "./contract";
import { scoreSystemAbi } from "./abi";

const scoreSystem = { address: scoreSystemAddress, abi: scoreSystemAbi } as const;

export type PlayerData = {
  score: bigint;
  registered: boolean;
  wonTshirt: boolean;
  lastPlayed: bigint;
};

// Values fixed at deploy, read once so the UI never drifts from the contract.
export type GameConfig = {
  admin: Address;
  cooldownTime: bigint;
  tshirtCost: bigint;
};

export type GameResult = {
  won: boolean;
  guessedNumber: bigint;
  correctNumber: bigint;
};

export async function getGameConfig(): Promise<GameConfig> {
  const [admin, cooldownTime, tshirtCost] = await Promise.all([
    publicClient.readContract({ ...scoreSystem, functionName: "admin" }),
    publicClient.readContract({ ...scoreSystem, functionName: "COOLDOWN_TIME" }),
    publicClient.readContract({ ...scoreSystem, functionName: "TSHIRT_COST" }),
  ]);
  return { admin, cooldownTime, tshirtCost };
}

export async function getPlayerData(user: Address): Promise<PlayerData> {
  const [score, registered, wonTshirt, lastPlayed] =
    await publicClient.readContract({
      ...scoreSystem,
      functionName: "getPlayerData",
      args: [user],
    });
  return { score, registered, wonTshirt, lastPlayed };
}

export async function connectWallet(): Promise<Address> {
  const [account] = await getWalletClient().requestAddresses();
  if (!account) throw new Error("No wallet account connected");
  return account;
}

async function getSigner() {
  const wallet = getWalletClient();
  const [account] = await wallet.getAddresses();
  if (!account) throw new Error("Connect your wallet first");
  return { wallet, account };
}

async function waitForConfirmation(hash: Hash): Promise<TransactionReceipt> {
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status === "reverted") {
    throw new Error("Transaction reverted");
  }
  return receipt;
}

// Every write simulates first so reverts surface with the contract's reason
// before the wallet prompts, then waits for the transaction to be mined.

export async function registerPlayer() {
  const { wallet, account } = await getSigner();
  const { request } = await publicClient.simulateContract({
    ...scoreSystem,
    functionName: "register",
    account,
  });
  return waitForConfirmation(await wallet.writeContract(request));
}

export async function adminGivePoints(to: Address, amount: bigint) {
  const { wallet, account } = await getSigner();
  const { request } = await publicClient.simulateContract({
    ...scoreSystem,
    functionName: "adminGivePoints",
    args: [to, amount],
    account,
  });
  return waitForConfirmation(await wallet.writeContract(request));
}

export async function buyTshirt() {
  const { wallet, account } = await getSigner();
  const { request } = await publicClient.simulateContract({
    ...scoreSystem,
    functionName: "buyTshirt",
    account,
  });
  return waitForConfirmation(await wallet.writeContract(request));
}

export async function transferPoints(to: Address, amount: bigint) {
  const { wallet, account } = await getSigner();
  const { request } = await publicClient.simulateContract({
    ...scoreSystem,
    functionName: "transferPoints",
    args: [to, amount],
    account,
  });
  return waitForConfirmation(await wallet.writeContract(request));
}

export async function playGame(guess: bigint): Promise<GameResult> {
  const { wallet, account } = await getSigner();
  const { request } = await publicClient.simulateContract({
    ...scoreSystem,
    functionName: "playGame",
    args: [guess],
    account,
    // Fixed limit: the random result depends on block.timestamp, so gas
    // estimation can pick the cheaper losing path and a win runs out of gas.
    gas: 100_000n,
  });
  const receipt = await waitForConfirmation(
    await wallet.writeContract(request),
  );

  const [event] = parseEventLogs({
    abi: scoreSystemAbi,
    eventName: "GamePlayed",
    logs: receipt.logs,
  });
  if (!event) throw new Error("Game result missing from transaction");

  const { won, guessedNumber, correctNumber } = event.args;
  return { won, guessedNumber, correctNumber };
}
