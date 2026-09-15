import type { Address } from 'viem';
import { registerPlayer } from '../../blockchain/contractFunctions';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useTransaction } from '../../hooks/useTransaction';
import { GameComponent } from '../game/GameComponent';

type BodyProps = {
  address?: Address;
};

export function BodyComponent({ address }: BodyProps) {
  const { player, error: playerError, refresh } = usePlayerData(address);
  const registerTx = useTransaction();

  const score = player?.score ?? 0n;
  const registered = player?.registered ?? false;
  const tshirtClaimed = player?.wonTshirt ?? false;

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
          <GameComponent address={address} player={player} onPlayed={refresh} />

          <div className='card profileCard'>
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

          <div className='card transferCard'>
            <p className='cardLabel'>POINTS</p>
            <h2>Transfer Points</h2>

            <p className='description'>
              Send some of your points to another registered member.
            </p>

            <label>Member address</label>
            <input type='text' placeholder='0x...' />

            <label>Amount</label>
            <input type='number' placeholder='Amount of points' />

            <button className='primaryButton'>Transfer Points</button>
          </div>

          <div className='card rewardCard'>
            <div className='rewardIcon'>👕</div>

            <div>
              <p className='cardLabel'>REWARD</p>
              <h2>Win a T-shirt</h2>
              <p className='description'>
                Redeem 50 points for your exclusive T-shirt.
              </p>
            </div>

            <div className='rewardBottom'>
              <span>Cost: 50 points</span>
              <button className='secondaryButton'>Buy T-shirt</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
