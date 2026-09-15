import { useState, type FormEvent } from 'react';
import type { Address } from 'viem';
import { adminGivePoints } from '../../blockchain/contractFunctions';
import { useMemberLookup } from '../../hooks/useMemberLookup';
import { useTransaction } from '../../hooks/useTransaction';
import { shortenAddress } from '../../utils/format';
import { parsePoints } from '../../utils/points';
import { CardHeading } from '../ui/CardHeading';
import { ShieldIcon } from '../ui/Icons';

type AdminProps = {
  onGiven: () => Promise<void>;
};

// Only rendered for the contract admin; the contract enforces it regardless.
export function AdminComponent({ onGiven }: AdminProps) {
  const [memberInput, setMemberInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [given, setGiven] = useState<{ to: Address; amount: bigint }>();
  const giveTx = useTransaction();

  const {
    member,
    data: memberData,
    error: memberError,
    refresh: refreshMember,
  } = useMemberLookup(memberInput);

  const amount = parsePoints(amountInput);
  const amountError =
    amountInput.trim() && amount === undefined
      ? 'Enter a whole number of points greater than 0.'
      : undefined;

  const canGive = member !== undefined && amount !== undefined && !giveTx.pending;

  async function handleGive(event: FormEvent) {
    event.preventDefault();
    if (!canGive || !member || amount === undefined) return;

    setGiven(undefined);
    const receipt = await giveTx.run(
      () => adminGivePoints(member, amount),
      async () => {
        await Promise.all([refreshMember(), onGiven()]);
      },
    );
    if (receipt) {
      setGiven({ to: member, amount });
      // Keep the member selected so their updated balance shows.
      setAmountInput('');
    }
  }

  return (
    <form className='card formCard adminCard' onSubmit={handleGive}>
      <CardHeading
        icon={<ShieldIcon />}
        label='ADMIN'
        title='Give Points'
        aside={<span className='badge admin'>Admin only</span>}
      />

      <p className='description'>
        Award points to any registered member. Only you, the contract admin,
        can see this panel.
      </p>

      <div className='adminFields'>
        <div>
          <label htmlFor='adminMember'>Member address</label>
          <input
            id='adminMember'
            type='text'
            placeholder='0x...'
            autoComplete='off'
            spellCheck={false}
            value={memberInput}
            onChange={(e) => {
              setMemberInput(e.target.value);
              setGiven(undefined);
            }}
          />
          {memberError && <p className='txError fieldMessage'>{memberError}</p>}
          {member && memberData && (
            <p className='fieldOk fieldMessage'>
              Registered member, {memberData.score.toString()} points
            </p>
          )}
        </div>

        <div>
          <label htmlFor='adminAmount'>Amount</label>
          <input
            id='adminAmount'
            type='number'
            min='1'
            step='1'
            placeholder='Amount of points'
            value={amountInput}
            onChange={(e) => {
              setAmountInput(e.target.value);
              setGiven(undefined);
            }}
          />
          {amountError && <p className='txError fieldMessage'>{amountError}</p>}
        </div>
      </div>

      <button type='submit' className='primaryButton' disabled={!canGive}>
        {giveTx.pending && <span className='spinner' aria-hidden='true' />}
        {giveTx.pending ? 'Giving...' : 'Give Points'}
      </button>

      {giveTx.pending && <p className='txHint'>Waiting for confirmation...</p>}
      {giveTx.error && <p className='txError'>{giveTx.error}</p>}
      {given && (
        <p className='fieldOk txSuccess'>
          Gave {given.amount.toString()} points to {shortenAddress(given.to)}.
        </p>
      )}
    </form>
  );
}
