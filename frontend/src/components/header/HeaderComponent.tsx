import type { Address } from 'viem';
import { hasWallet } from '../../blockchain/viem';
import { shortenAddress } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { WalletIcon } from '../ui/Icons';

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
            <span className='logoSubtitle'>On-chain daily game</span>
          </div>
        </div>

        {address ? (
          <button
            className='walletButton connected'
            onClick={handleConnect}
            title={address}
          >
            <Avatar address={address} size={22} />
            <span className='walletAddress'>{shortenAddress(address)}</span>
          </button>
        ) : (
          <button
            className={`walletButton ${hasWallet() ? '' : 'noWallet'}`}
            onClick={handleConnect}
          >
            <WalletIcon size={16} />
            {hasWallet() ? 'Connect Wallet' : 'No Wallet Found'}
          </button>
        )}
      </div>
    </header>
  );
}
