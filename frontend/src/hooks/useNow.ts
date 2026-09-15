import { useEffect, useState } from "react";

// Current time in milliseconds, re-rendering the caller every interval.
export function useNow(intervalMs = 1_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
