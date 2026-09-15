import './App.css'
import { scoreSystemAddress } from './blockchain/contract'
import { chain } from './blockchain/viem'
import { BodyComponent } from './components/body/BodyComponent'
import { HeaderComponent } from './components/header/HeaderComponent'
import { useWallet } from './hooks/useWallet'
import { shortenAddress } from './utils/format'

function App() {
  const { address, connect } = useWallet()

  return <>
  <HeaderComponent address={address} onConnect={connect}></HeaderComponent>
  {/* Keyed by account so results and errors reset when the wallet switches */}
  <BodyComponent key={address} address={address}></BodyComponent>
  <footer className='footer'>
    <span>
      Contract <code title={scoreSystemAddress}>{shortenAddress(scoreSystemAddress)}</code>
    </span>
    <span className='footerDot' aria-hidden='true' />
    <span>{chain.name} (chain {chain.id})</span>
  </footer>
  </>
}

export default App
