import { useEffect, useState } from "react";
import type { Address } from "viem";
import { connectWallet } from "../blockchain/contractFunctions";

export function useWallet() {
  const [address, setAddress] = useState<Address>();

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    // Restore an account the user already authorised, without prompting.
    provider
      .request({ method: "eth_accounts" })
      .then((accounts) => setAddress(accounts[0]))
      .catch(console.error);

    const handleAccountsChanged = (accounts: Address[]) =>
      setAddress(accounts[0]);
    provider.on("accountsChanged", handleAccountsChanged);
    return () =>
      provider.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  async function connect() {
    setAddress(await connectWallet());
  }

  return { address, connect };
}
