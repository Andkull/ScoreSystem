import { useState } from 'react';
import type { Address } from 'viem';
import {
  playGame,
  type GameResult,
  type PlayerData,
} from '../../blockchain/contractFunctions';
import { useNow } from '../../hooks/useNow';
import { useTransaction } from '../../hooks/useTransaction';
import { CardHeading } from '../ui/CardHeading';
import { CheckIcon, ClockIcon, CrossIcon, DiceIcon } from '../ui/Icons';

type GameProps = {
  address?: Address;
  player?: PlayerData;
  cooldownTime?: bigint;
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

export function GameComponent({
  address,
  player,
  cooldownTime,
  onPlayed,
}: GameProps) {
  const [guess, setGuess] = useState<bigint>();
  const [result, setResult] = useState<GameResult>();
  const playTx = useTransaction();
  const now = useNow();

  const registered = player?.registered ?? false;
  const hasPlayed = (player?.lastPlayed ?? 0n) > 0n;
  // A returning player's cooldown is unknown until the contract config loads.
  const cooldownKnown = !hasPlayed || cooldownTime !== undefined;
  const nextPlayAt =
    player && hasPlayed && cooldownTime !== undefined
      ? player.lastPlayed + cooldownTime
      : 0n;
  const secondsLeft = Math.max(0, Number(nextPlayAt) - Math.floor(now / 1000));
  const onCooldown = secondsLeft > 0;
  const ready = registered && cooldownKnown && !onCooldown;
  const canPlay = ready && !playTx.pending;

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
      <CardHeading
        icon={<DiceIcon />}
        label='DAILY GAME'
        title='Guess the Number'
        aside={
          <span className={`badge ${ready ? 'ready' : ''}`}>
            <ClockIcon size={13} />
            {ready
              ? 'Ready to play'
              : onCooldown
                ? `Next play in ${formatDuration(secondsLeft)}`
                : '24h cooldown'}
          </span>
        }
      />

      <p className='description'>
        Pick a number between 1 and 3. Guess correctly and earn 10 points.
      </p>

      <div className='gameControls'>
        <div className='numberButtons'>
          {GUESSES.map((number) => (
            <button
              key={number.toString()}
              className={guess === number ? 'selected' : ''}
              disabled={!canPlay}
              onClick={() => setGuess(number)}
              aria-pressed={guess === number}
            >
              {number.toString()}
            </button>
          ))}
        </div>

        <button
          className='primaryButton playButton'
          disabled={!canPlay || guess === undefined}
          onClick={handlePlay}
        >
          {playTx.pending && <span className='spinner' aria-hidden='true' />}
          {playTx.pending ? 'Playing...' : 'Play Game'}
        </button>
      </div>

      {result && (
        <div className={`gameResult ${result.won ? 'won' : 'lost'}`}>
          <span className='gameResultIcon'>
            {result.won ? <CheckIcon size={18} /> : <CrossIcon size={18} />}
          </span>
          <div>
            <strong>{result.won ? 'You won! +10 points' : 'Not this time'}</strong>
            <span>
              You guessed {result.guessedNumber.toString()}, the number was{' '}
              {result.correctNumber.toString()}.
            </span>
          </div>
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
    </div>
  );
}
