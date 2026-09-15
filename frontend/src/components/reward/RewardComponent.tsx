import { useState } from 'react';
import type { Address } from 'viem';
import { buyTshirt, type PlayerData } from '../../blockchain/contractFunctions';
import { useTransaction } from '../../hooks/useTransaction';
import { CardHeading } from '../ui/CardHeading';
import { CheckIcon, ShirtIcon } from '../ui/Icons';

type RewardProps = {
  address?: Address;
  player?: PlayerData;
  tshirtCost?: bigint;
  onPurchased: () => Promise<void>;
};

export function RewardComponent({
  address,
  player,
  tshirtCost,
  onPurchased,
}: RewardProps) {
  const [justBought, setJustBought] = useState(false);
  const buyTx = useTransaction();

  const registered = player?.registered ?? false;
  const owned = player?.wonTshirt ?? false;
  const score = player?.score ?? 0n;
  const costText = tshirtCost?.toString() ?? '...';

  const pointsNeeded =
    tshirtCost !== undefined && score < tshirtCost ? tshirtCost - score : 0n;
  const progressPercent =
    tshirtCost && tshirtCost > 0n
      ? Math.min(100, Number((score * 100n) / tshirtCost))
      : 0;

  const canBuy =
    registered &&
    !owned &&
    tshirtCost !== undefined &&
    pointsNeeded === 0n &&
    !buyTx.pending;

  async function handleBuy() {
    setJustBought(false);
    const receipt = await buyTx.run(buyTshirt, onPurchased);
    if (receipt) setJustBought(true);
  }

  return (
    <div className={`card rewardCard ${owned ? 'owned' : ''}`}>
      <CardHeading
        icon={owned ? <CheckIcon /> : <ShirtIcon />}
        label='REWARD'
        title={owned ? 'T-shirt claimed' : 'Win a T-shirt'}
      />

      <p className='description'>
        {owned
          ? 'The exclusive T-shirt is yours. Thanks for playing!'
          : `Redeem ${costText} points for your exclusive T-shirt.`}
      </p>

      {registered && !owned && tshirtCost !== undefined && (
        <div className='rewardProgress'>
          <div className='rewardProgressHeader'>
            <span>
              <strong>{score.toString()}</strong> / {costText} points
            </span>
            <span>
              {pointsNeeded > 0n
                ? `${pointsNeeded.toString()} to go`
                : 'Ready to redeem'}
            </span>
          </div>
          <div
            className='rewardProgressBar'
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {!address && <p className='txHint'>Connect your wallet to redeem.</p>}
      {address && player && !registered && (
        <p className='txHint'>Register in your profile to redeem.</p>
      )}
      {buyTx.pending && <p className='txHint'>Waiting for confirmation...</p>}
      {buyTx.error && <p className='txError'>{buyTx.error}</p>}
      {justBought && (
        <p className='fieldOk txSuccess'>
          T-shirt claimed! {costText} points spent.
        </p>
      )}

      <div className='rewardBottom'>
        <span>
          Cost <strong>{costText}</strong> points
        </span>
        <button
          className={owned ? 'secondaryButton' : 'primaryButton'}
          disabled={!canBuy}
          onClick={handleBuy}
        >
          {buyTx.pending && <span className='spinner' aria-hidden='true' />}
          {buyTx.pending ? 'Buying...' : owned ? 'Claimed' : 'Buy T-shirt'}
        </button>
      </div>
    </div>
  );
}
