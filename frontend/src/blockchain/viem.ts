import { createPublicClient, createWalletClient, custom, http } from "viem";

import { anvil } from "viem/chains";

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http("http://127.0.0.1:8545"),
});

export const walletClient = createWalletClient({
  chain: anvil,
  transport: custom(window.ethereum),
});

