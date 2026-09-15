import { createPublicClient, createWalletClient, custom, http } from "viem";
import { anvil } from "viem/chains";

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http("http://127.0.0.1:8545"),
});

export const hasWallet =
  typeof window !== "undefined" && Boolean(window.ethereum);

export const walletClient = hasWallet
  ? createWalletClient({
      chain: anvil,
      transport: custom(window.ethereum!),
    })
  : undefined;