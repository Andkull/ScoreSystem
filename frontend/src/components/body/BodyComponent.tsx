import { isAddressEqual, type Address } from 'viem';
import { registerPlayer } from '../../blockchain/contractFunctions';
import { useGameConfig } from '../../hooks/useGameConfig';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useTransaction } from '../../hooks/useTransaction';
import { shortenAddress } from '../../utils/format';
import { AdminComponent } from '../admin/AdminComponent';
import { GameComponent } from '../game/GameComponent';
import { RewardComponent } from '../reward/RewardComponent';
import { TransferComponent } from '../transfer/TransferComponent';
import { Avatar } from '../ui/Avatar';
import { CardHeading } from '../ui/CardHeading';
import { UserIcon } from '../ui/Icons';

type BodyProps = {
  address?: Address;
};

function formatLastPlayed(lastPlayed: bigint) {
  if (lastPlayed === 0n) return 'Never';
  return new Date(Number(lastPlayed) * 1000).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function BodyComponent({ address }: BodyProps) {
  const config = useGameConfig();
  const { player, error: playerError, refresh } = usePlayerData(address);
  const registerTx = useTransaction();

  const score = player?.score ?? 0n;
  const registered = player?.registered ?? false;
  const tshirtClaimed = player?.wonTshirt ?? false;
  const isAdmin = Boolean(
    address && config && isAddressEqual(address, config.admin),
  );

  const status = !address
    ? { text: 'Not connected', tone: 'neutral' }
    : !player
      ? { text: 'Loading', tone: 'neutral' }
      : registered
        ? { text: 'Registered', tone: 'success' }
        : { text: 'Not registered', tone: 'warning' };

  async function handleRegister() {
    await registerTx.run(registerPlayer, refresh);
  }

  return (
    <main className='main'>
      <section className='hero'>
        <div className='heroCopy'>
          <p className='eyebrow'>
            <span className='eyebrowDot' aria-hidden='true' />
            On-chain daily game
          </p>
          <h1>
            Guess. Earn. <span className='gradientText'>Redeem.</span>
          </h1>
          <p className='heroText'>
            Guess the number once a day to earn points, send points to other
            members, and redeem {config?.tshirtCost.toString() ?? 'them'} for
            an exclusive T-shirt.
          </p>
        </div>

        <div className='scoreCard'>
          <span className='scoreLabel'>Your score</span>
          <strong>{address && player ? score.toString() : '—'}</strong>
          <small>{address ? 'points' : 'Connect a wallet to play'}</small>
        </div>
      </section>

      <section className='dashboard'>
        <GameComponent
          address={address}
          player={player}
          cooldownTime={config?.cooldownTime}
          onPlayed={refresh}
        />

        <div className='card profileCard'>
          <CardHeading
            icon={<UserIcon />}
            label='PLAYER'
            title='Your Profile'
            aside={
              <span className={`statusPill ${status.tone}`}>{status.text}</span>
            }
          />

          {address ? (
            <div className='identity'>
              <Avatar address={address} size={44} />
              <div>
                <strong title={address}>{shortenAddress(address)}</strong>
                <span>{isAdmin ? 'Contract admin' : 'Connected wallet'}</span>
              </div>
            </div>
          ) : (
            <p className='txHint'>Connect your wallet to see your profile.</p>
          )}

          <dl className='profileInfo'>
            <div>
              <dt>Score</dt>
              <dd>{score.toString()} points</dd>
            </div>
            <div>
              <dt>T-shirt</dt>
              <dd>{tshirtClaimed ? 'Claimed' : 'Not claimed'}</dd>
            </div>
            <div>
              <dt>Last played</dt>
              <dd>{player ? formatLastPlayed(player.lastPlayed) : '—'}</dd>
            </div>
          </dl>

          {address && player && !registered && (
            <button
              className='primaryButton fullWidth'
              disabled={registerTx.pending}
              onClick={handleRegister}
            >
              {registerTx.pending && <span className='spinner' aria-hidden='true' />}
              {registerTx.pending ? 'Registering...' : 'Register to play'}
            </button>
          )}

          {registerTx.error && <p className='txError'>{registerTx.error}</p>}
          {playerError && (
            <p className='txError'>Could not load player data: {playerError}</p>
          )}
        </div>

        <TransferComponent
          address={address}
          player={player}
          onTransferred={refresh}
        />

        <RewardComponent
          address={address}
          player={player}
          tshirtCost={config?.tshirtCost}
          onPurchased={refresh}
        />

        {isAdmin && <AdminComponent onGiven={refresh} />}
      </section>
    </main>
  );
}
