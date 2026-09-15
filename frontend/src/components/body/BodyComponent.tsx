import { isAddressEqual, type Address } from 'viem';
import { registerPlayer } from '../../blockchain/contractFunctions';
import { useGameConfig } from '../../hooks/useGameConfig';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useTransaction } from '../../hooks/useTransaction';
import { AdminComponent } from '../admin/AdminComponent';
import { GameComponent } from '../game/GameComponent';
import { RewardComponent } from '../reward/RewardComponent';
import { TransferComponent } from '../transfer/TransferComponent';

type BodyProps = {
  address?: Address;
};

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

  async function handleRegister() {
    await registerTx.run(registerPlayer);
    refresh();
  }

  return (
    <>
      <main className='main'>
        <section className='hero'>
          <div>
            <p className='eyebrow'>BLOCKCHAIN GAME</p>
            <h1>Score System</h1>
            <p className='heroText'>
              Play the game, earn points, compete with other members and redeem
              your points for rewards.
            </p>
          </div>

          <div className='scoreCard'>
            <span>Your Score</span>
            <strong>{score.toString()}</strong>
            <small>points</small>
          </div>
        </section>

        <section className='dashboard'>
          <GameComponent
            address={address}
            player={player}
            cooldownTime={config?.cooldownTime}
            onPlayed={refresh}
          />

          <div id='profile' className='card profileCard'>
            <p className='cardLabel'>PLAYER</p>
            <h2>Your Profile</h2>

            <div className='profileInfo'>
              <div>
                <span>Status</span>
                <strong>
                  {!address
                    ? 'Wallet not connected'
                    : registered
                      ? 'Registered'
                      : 'Not registered'}
                </strong>
              </div>

              <div>
                <span>Score</span>
                <strong>{score.toString()} points</strong>
              </div>

              <div>
                <span>T-shirt</span>
                <strong>{tshirtClaimed ? 'Claimed' : 'Not claimed'}</strong>
              </div>
            </div>

            <button
              className='secondaryButton'
              disabled={!player || registered || registerTx.pending}
              onClick={handleRegister}
            >
              {registerTx.pending
                ? 'Registering...'
                : registered
                  ? 'Registered'
                  : 'Register'}
            </button>

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
    </>
  );
}
