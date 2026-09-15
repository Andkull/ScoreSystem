# ScoreSystem frontend

React + TypeScript + Vite app for the ScoreSystem contract, using [viem](https://viem.sh) to talk to the chain. See the [root README](../README.md) for the full local setup (Anvil, deploy, MetaMask).

## Scripts

```bash
npm ci          # install dependencies
npm run dev     # start the dev server at http://localhost:5173
npm run lint    # ESLint
npm run build   # typecheck and production build into dist/
npm run preview # serve the production build
```

## Structure

```
src/
  blockchain/
    abi.ts                ScoreSystem ABI (typed with `as const`)
    contract.ts           Deployed contract address
    viem.ts               Chain, public client and wallet client
    contractFunctions.ts  All contract reads and writes
    errors.ts             Turns viem errors into short UI messages
  hooks/
    useWallet.ts          Connected account, follows wallet account changes
    usePlayerData.ts      Player data for an address, with an awaitable refresh
    useTransaction.ts     Pending state and error for one kind of write
    useGameConfig.ts      Contract values fixed at deploy (admin, cooldown, T-shirt cost)
    useMemberLookup.ts    Validates a typed address and checks membership on chain
    useNow.ts             Ticking clock for the cooldown countdown
  components/
    header/  body/  game/  transfer/  reward/  admin/   One component per section
    ui/                   Shared icons, card heading and address avatar
  utils/                  Formatting and point parsing helpers
```

## Pointing at a different deployment

- **Contract address:** `src/blockchain/contract.ts`
- **Chain and RPC URL:** `src/blockchain/viem.ts`
- **ABI:** after changing the contract, regenerate it with `forge inspect ScoreSystem abi --json` (run in `contracts/`) and update `src/blockchain/abi.ts`, keeping the `as const`.
