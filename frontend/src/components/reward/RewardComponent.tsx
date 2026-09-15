import { useState } from 'react';
import type { Address } from 'viem';
import { buyTshirt, type PlayerData } from '../../blockchain/contractFunctions';
import { useTransaction } from '../../hooks/useTransaction';

type RewardProps = {
  address?: Address;
  player?: PlayerData;
  tshirtCost?: bigint;
  onPurchased: () => void;
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
    const receipt = await buyTx.run(buyTshirt);
    if (receipt) setJustBought(true);
    onPurchased();
  }

  return (
    <div id='rewards' className={`card rewardCard ${owned ? 'owned' : ''}`}>
      <div className='rewardIcon'>👕</div>

      <div>
        <p className='cardLabel'>REWARD</p>
        <h2>{owned ? 'T-shirt claimed' : 'Win a T-shirt'}</h2>
        <p className='description'>
          {owned
            ? 'The exclusive T-shirt is yours. Thanks for playing!'
            : `Redeem ${costText} points for your exclusive T-shirt.`}
        </p>

        {registered && !owned && tshirtCost !== undefined && (
          <div className='rewardProgress'>
            <div className='rewardProgressBar'>
              <div style={{ width: `${progressPercent}%` }} />
            </div>
            <span>
              {pointsNeeded > 0n
                ? `${score.toString()} / ${costText} points, earn ${pointsNeeded.toString()} more`
                : 'You have enough points!'}
            </span>
          </div>
        )}
      </div>

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
        <span>Cost: {costText} points</span>
        <button
          className='secondaryButton'
          disabled={!canBuy}
          onClick={handleBuy}
        >
          {buyTx.pending ? 'Buying...' : owned ? 'Claimed' : 'Buy T-shirt'}
        </button>
      </div>
    </div>
  );
}
