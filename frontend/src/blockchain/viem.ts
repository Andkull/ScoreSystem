import { createPublicClient, http } from "viem";
import { anvil } from "viem/chains";

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http('127.0.0.1:8545'),
});