import { useState } from 'react';
import type { Address } from 'viem';
import {
  playGame,
  type GameResult,
  type PlayerData,
} from '../../blockchain/contractFunctions';
import { useNow } from '../../hooks/useNow';
import { useTransaction } from '../../hooks/useTransaction';

type GameProps = {
  address?: Address;
  player?: PlayerData;
  onPlayed: () => void;
};

const GUESSES = [1n, 2n, 3n];

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}h ${minutes}m ${seconds}s`
    : `${minutes}m ${seconds}s`;
}

export function GameComponent({ address, player, onPlayed }: GameProps) {
  const [guess, setGuess] = useState<bigint>();
  const [result, setResult] = useState<GameResult>();
  const playTx = useTransaction();
  const now = useNow();

  const registered = player?.registered ?? false;
  const secondsLeft = player
    ? Math.max(0, Number(player.nextPlayAt) - Math.floor(now / 1000))
    : 0;
  const onCooldown = secondsLeft > 0;
  const canPlay = registered && !onCooldown && !playTx.pending;

  async function handlePlay() {
    if (guess === undefined) return;
    setResult(undefined);
    const outcome = await playTx.run(() => playGame(guess));
    if (outcome) {
      setResult(outcome);
      setGuess(undefined);
    }
    onPlayed();
  }

  return (
    <div className='card gameCard'>
      <div className='cardHeader'>
        <div>
          <p className='cardLabel'>DAILY GAME</p>
          <h2>Guess the Number</h2>
        </div>

        <span className={`cooldown ${registered && !onCooldown ? 'ready' : ''}`}>
          {!registered
            ? '24h cooldown'
            : onCooldown
              ? `Next play in ${formatDuration(secondsLeft)}`
              : 'Ready to play'}
        </span>
      </div>

      <p className='description'>
        Pick a number between 1 and 3. Guess correctly and earn 10 points.
      </p>

      <div className='numberButtons'>
        {GUESSES.map((number) => (
          <button
            key={number.toString()}
            className={guess === number ? 'selected' : ''}
            disabled={!canPlay}
            onClick={() => setGuess(number)}
          >
            {number.toString()}
          </button>
        ))}
      </div>

      {result && (
        <div className={`gameResult ${result.won ? 'won' : 'lost'}`}>
          <strong>{result.won ? 'You won! +10 points' : 'Not this time'}</strong>
          <span>
            You guessed {result.guessedNumber.toString()}, the number was{' '}
            {result.correctNumber.toString()}.
          </span>
        </div>
      )}

      {!address && <p className='txHint'>Connect your wallet to play.</p>}
      {address && player && !registered && (
        <p className='txHint'>Register in your profile to play.</p>
      )}
      {canPlay && guess === undefined && !result && (
        <p className='txHint'>Choose a number, then press Play Game.</p>
      )}
      {playTx.pending && <p className='txHint'>Waiting for confirmation...</p>}
      {playTx.error && <p className='txError'>{playTx.error}</p>}

      <button
        className='primaryButton'
        disabled={!canPlay || guess === undefined}
        onClick={handlePlay}
      >
        {playTx.pending ? 'Playing...' : 'Play Game'}
      </button>
    </div>
  );
}
