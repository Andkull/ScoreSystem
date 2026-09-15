import type { Address, Hash, TransactionReceipt } from "viem";
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

export async function playGame(guess: bigint) {
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
  return waitForConfirmation(await wallet.writeContract(request));
}
