import './App.css'
import { BodyComponent } from './components/body/BodyComponent'
import { HeaderComponent } from './components/header/HeaderComponent'
import { useWallet } from './hooks/useWallet'

function App() {
  const { address, connect } = useWallet()

  return <>
  <HeaderComponent address={address} onConnect={connect}></HeaderComponent>
  {/* Keyed by account so results and errors reset when the wallet switches */}
  <BodyComponent key={address} address={address}></BodyComponent>
  </>
}

export default App
