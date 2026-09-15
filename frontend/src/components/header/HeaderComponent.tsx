import type { Address } from 'viem';
import { hasWallet } from '../../blockchain/viem';
import { shortenAddress } from '../../utils/format';

type HeaderProps = {
  address?: Address;
  onConnect: () => Promise<void>;
};

export function HeaderComponent({ address, onConnect }: HeaderProps) {
  async function handleConnect() {
    if (!hasWallet()) {
      alert('No wallet extension detected. Please install MetaMask to connect.');
      return;
    }
    try {
      await onConnect();
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
          {address
            ? shortenAddress(address)
            : hasWallet() ? 'Connect Wallet' : 'No Wallet Found'}
        </button>
      </div>
    </header>
  );
}