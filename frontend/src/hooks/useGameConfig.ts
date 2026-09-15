import { useEffect, useState } from "react";
import { getGameConfig, type GameConfig } from "../blockchain/contractFunctions";

// Loads the contract's constants once; they can't change without a redeploy.
export function useGameConfig() {
  const [config, setConfig] = useState<GameConfig>();

  useEffect(() => {
    let ignore = false;
    getGameConfig()
      .then((result) => {
        if (!ignore) setConfig(result);
      })
      .catch(console.error);
    return () => {
      ignore = true;
    };
  }, []);

  return config;
}
