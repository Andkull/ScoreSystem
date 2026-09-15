import { connectWallet } from '../../blockchain/contractFunctions';
import { hasWallet } from '../../blockchain/viem';
import { useState } from 'react';

export function HeaderComponent() {
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>();

  async function handleConnect() {
    if (!hasWallet) {
      alert('No wallet extension detected. Please install MetaMask to connect.');
      return;
    }
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header className='header'>
      <div className='headerInner'>
        <div className='logo'>
          <div className='logoMark'>S</div>
          <div>
            <span className='logoTitle'>ScoreSystem</span>
            <span className='logoSubtitle'>Web3 Game</span>
          </div>
        </div>

        <nav className='navigation'>
          <a href='#game'>Game</a>
          <a href='#profile'>Profile</a>
          <a href='#rewards'>Rewards</a>
        </nav>

        <button className='walletButton' onClick={handleConnect}>
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : hasWallet ? 'Connect Wallet' : 'No Wallet Found'}
        </button>
      </div>
    </header>
  );
}