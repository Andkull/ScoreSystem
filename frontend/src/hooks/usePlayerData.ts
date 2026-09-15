import { useEffect, useState } from "react";
import type { Address } from "viem";
import {
  getPlayerData,
  type PlayerData,
} from "../blockchain/contractFunctions";
import { getErrorMessage } from "../blockchain/errors";

type Result = { address: Address; data?: PlayerData; error?: string };

export function usePlayerData(address?: Address) {
  const [result, setResult] = useState<Result>();
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!address) return;

    let ignore = false;
    getPlayerData(address)
      .then((data) => {
        if (!ignore) setResult({ address, data });
      })
      .catch((err) => {
        if (!ignore) setResult({ address, error: getErrorMessage(err) });
      });
    return () => {
      ignore = true;
    };
  }, [address, reloadKey]);

  // Ignore a result that belongs to a previously connected account.
  const current = result?.address === address ? result : undefined;

  return {
    player: current?.data,
    error: current?.error,
    refresh: () => setReloadKey((key) => key + 1),
  };
}
