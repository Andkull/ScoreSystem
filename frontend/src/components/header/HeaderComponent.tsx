import { connectWallet } from '../../blockchain/contractFunctions';
import { useState } from 'react';

export function HeaderComponent() {
  const [walletAddress, setWalletAddress] = useState<
    `0x${string}` | undefined
  >();
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

        <button
          className='walletButton'
          onClick={async () => {
            const address = await connectWallet();
            setWalletAddress(address);
          }}
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
