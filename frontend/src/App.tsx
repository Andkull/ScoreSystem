import './App.css'
import { BodyComponent } from './components/body/BodyComponent'
import { HeaderComponent } from './components/header/HeaderComponent'
import { useWallet } from './hooks/useWallet'

function App() {
  const { address, connect } = useWallet()

  return <>
  <HeaderComponent address={address} onConnect={connect}></HeaderComponent>
  <BodyComponent address={address}></BodyComponent>
  </>
}

export default App
