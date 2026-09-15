import { useState } from "react";
import { getErrorMessage } from "../blockchain/errors";

// Tracks one kind of contract write: whether it is in flight and the last error.
export function useTransaction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function run(action: () => Promise<unknown>) {
    setPending(true);
    setError(undefined);
    try {
      await action();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return { run, pending, error };
}
