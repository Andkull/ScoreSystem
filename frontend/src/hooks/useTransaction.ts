import { useState } from "react";
import { getErrorMessage } from "../blockchain/errors";

// Tracks one kind of contract write: whether it is in flight and the last error.
export function useTransaction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  // Resolves to the action's result, or undefined if it failed. `onSettled`
  // (typically a data refresh) runs before pending clears, so buttons don't
  // briefly re-enable while the page still shows pre-transaction data.
  async function run<T>(
    action: () => Promise<T>,
    onSettled?: () => Promise<void>,
  ): Promise<T | undefined> {
    setPending(true);
    setError(undefined);
    try {
      return await action();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
      return undefined;
    } finally {
      if (onSettled) await onSettled();
      setPending(false);
    }
  }

  return { run, pending, error };
}
