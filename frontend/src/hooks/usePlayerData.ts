import { useEffect, useRef, useState } from "react";
import type { Address } from "viem";
import {
  getPlayerData,
  type PlayerData,
} from "../blockchain/contractFunctions";
import { getErrorMessage } from "../blockchain/errors";

type Result = { address: Address; data?: PlayerData; error?: string };

async function loadPlayer(address: Address): Promise<Result> {
  try {
    return { address, data: await getPlayerData(address) };
  } catch (err) {
    return { address, error: getErrorMessage(err) };
  }
}

export function usePlayerData(address?: Address) {
  const [result, setResult] = useState<Result>();
  const addressRef = useRef(address);

  useEffect(() => {
    addressRef.current = address;
    if (!address) return;

    let ignore = false;
    loadPlayer(address).then((loaded) => {
      if (!ignore) setResult(loaded);
    });
    return () => {
      ignore = true;
    };
  }, [address]);

  // Ignore a result that belongs to a previously connected account.
  const current = result?.address === address ? result : undefined;

  return {
    player: current?.data,
    error: current?.error,
    // Resolves once fresh data is in state, so callers can wait for it.
    refresh: async () => {
      if (!address) return;
      const loaded = await loadPlayer(address);
      if (addressRef.current === address) setResult(loaded);
    },
  };
}
