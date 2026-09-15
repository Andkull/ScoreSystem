import { isAddress, isAddressEqual, type Address } from "viem";
import { usePlayerData } from "./usePlayerData";

// Validates a typed address and, once it's complete, checks on chain that it
// belongs to a registered member. Pass `self` to reject the user's own address.
export function useMemberLookup(input: string, self?: Address) {
  const text = input.trim();
  const address = isAddress(text) ? text : undefined;
  const isSelf = Boolean(address && self && isAddressEqual(address, self));
  const { player: data, refresh } = usePlayerData(isSelf ? undefined : address);

  let error: string | undefined;
  if (text && !address) {
    error = "Enter a valid address (0x followed by 40 hex characters).";
  } else if (isSelf) {
    error = "That's your own address.";
  } else if (data && !data.registered) {
    error = "This address isn't a registered member.";
  }

  return {
    member: data?.registered ? address : undefined,
    data,
    error,
    refresh,
  };
}
