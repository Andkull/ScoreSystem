import { publicClient, walletClient } from "./viem";
import { scoreSystemAddress } from "./contract";
import { scoreSystemAbi } from "./abi";

function requireWallet() {
  if (!walletClient) {
    throw new Error(
      "No wallet extension detected. Please install MetaMask to connect.",
    );
  }
  return walletClient;
}

export async function getPlayerData(
  userAddress: `0x${string}`,
): Promise<[bigint, boolean, boolean, bigint]> {
  return publicClient.readContract({
    address: scoreSystemAddress,
    abi: scoreSystemAbi,
    functionName: "getPlayerData",
    args: [userAddress],
  }) as Promise<[bigint, boolean, boolean, bigint]>;
}

export async function registerPlayer(): Promise<`0x${string}`> {
  const client = requireWallet();
  const [account] = await client.getAddresses();
  if (!account) throw new Error("No wallet account connected");

  return client.writeContract({
    address: scoreSystemAddress,
    abi: scoreSystemAbi,
    functionName: "register",
    account,
  });
}

export async function connectWallet(): Promise<`0x${string}`> {
  const client = requireWallet();
  const [account] = await client.requestAddresses();

  console.log("CONNECTED ACCOUNT:", account);

  if (!account) throw new Error("No wallet account connected");

  return account;
}

export async function playGame(guess: bigint): Promise<`0x${string}`> {
  try {
    const client = requireWallet();
    const [account] = await client.getAddresses();

    if (!account) throw new Error("No wallet account connected");

    const hash = await client.writeContract({
      address: scoreSystemAddress,
      abi: scoreSystemAbi,
      functionName: "playGame",
      args: [guess],
      account,
      gas: 100000n,
    });

    console.log("PLAY GAME TX:", hash);

    return hash;
  } catch (error) {
    console.error("PLAY GAME FAILED:", error);
    throw error;
  }
}
