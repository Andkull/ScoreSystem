import { publicClient, walletClient } from './viem';
import { scoreSystemAddress } from './contract';
import { scoreSystemAbi } from './abi';

export async function getPlayerData(
  userAddress: `0x${string}`,
): Promise<[bigint, boolean, boolean, bigint]> {
  return publicClient.readContract({
    address: scoreSystemAddress,
    abi: scoreSystemAbi,
    functionName: 'getPlayerData',
    args: [userAddress],
  }) as Promise<[bigint, boolean, boolean, bigint]>;
}

export async function registerPlayer(): Promise<`0x${string}`> {
  const [account] = await walletClient.getAddresses();

  if (!account) {
    throw new Error("No wallet account connected");
  }

  const hash = await walletClient.writeContract({
    address: scoreSystemAddress,
    abi: scoreSystemAbi,
    functionName: 'register',
    account,
  });

  return hash;
}

export async function connectWallet(): Promise<`0x${string}`> {
  const [account] = await walletClient.requestAddresses();


  if (!account) {
    throw new Error("No wallet account connected");
  }

  return account;
}

export async function playGame(
  guess: bigint,
): Promise<`0x${string}`> {
  const [account] = await walletClient.getAddresses();

  if (!account) {
    throw new Error("No wallet account connected");
  }

  const hash = await walletClient.writeContract({
    address: scoreSystemAddress,
    abi: scoreSystemAbi,
    functionName: 'playGame',
    args: [guess],
    account,
  });

  return hash;
}