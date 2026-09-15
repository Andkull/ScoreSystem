import { createPublicClient, createWalletClient, custom, http } from "viem";
import { anvil } from "viem/chains";

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http("http://127.0.0.1:8545"),
  // Anvil mines instantly, so poll for receipts faster than viem's 4s default.
  pollingInterval: 1_000,
});

// Read window.ethereum at call time rather than at import, so a wallet
// injected after the page loads is still picked up.
export function hasWallet() {
  return typeof window !== "undefined" && Boolean(window.ethereum);
}

export function getWalletClient() {
  if (!window.ethereum) {
    throw new Error(
      "No wallet extension detected. Please install MetaMask to connect.",
    );
  }
  return createWalletClient({
    chain: anvil,
    transport: custom(window.ethereum),
  });
}
