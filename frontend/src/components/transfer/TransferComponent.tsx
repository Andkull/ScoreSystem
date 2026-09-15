import { useState, type FormEvent } from 'react';
import type { Address } from 'viem';
import {
  transferPoints,
  type PlayerData,
} from '../../blockchain/contractFunctions';
import { useMemberLookup } from '../../hooks/useMemberLookup';
import { useTransaction } from '../../hooks/useTransaction';
import { shortenAddress } from '../../utils/format';
import { parsePoints } from '../../utils/points';

type TransferProps = {
  address?: Address;
  player?: PlayerData;
  onTransferred: () => void;
};

export function TransferComponent({
  address,
  player,
  onTransferred,
}: TransferProps) {
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [sent, setSent] = useState<{ to: Address; amount: bigint }>();
  const transferTx = useTransaction();

  const registered = player?.registered ?? false;
  const score = player?.score ?? 0n;

  const { member: recipient, error: recipientError } = useMemberLookup(
    recipientInput,
    address,
  );

  const amount = parsePoints(amountInput);
  let amountError: string | undefined;
  if (amountInput.trim() && amount === undefined) {
    amountError = 'Enter a whole number of points greater than 0.';
  } else if (amount !== undefined && amount > score) {
    amountError = `You only have ${score.toString()} points.`;
  }

  const canTransfer =
    registered &&
    recipient !== undefined &&
    amount !== undefined &&
    amount <= score &&
    !transferTx.pending;

  async function handleTransfer(event: FormEvent) {
    event.preventDefault();
    if (!canTransfer || !recipient || amount === undefined) return;

    setSent(undefined);
    const receipt = await transferTx.run(() =>
      transferPoints(recipient, amount),
    );
    if (receipt) {
      setSent({ to: recipient, amount });
      setRecipientInput('');
      setAmountInput('');
    }
    onTransferred();
  }

  return (
    <form className='card formCard transferCard' onSubmit={handleTransfer}>
      <p className='cardLabel'>POINTS</p>
      <h2>Transfer Points</h2>

      <p className='description'>
        Send some of your points to another registered member.
      </p>

      {!address && (
        <p className='txHint'>Connect your wallet to transfer points.</p>
      )}
      {address && player && !registered && (
        <p className='txHint'>Register in your profile to transfer points.</p>
      )}

      <label htmlFor='transferRecipient'>Member address</label>
      <input
        id='transferRecipient'
        type='text'
        placeholder='0x...'
        autoComplete='off'
        spellCheck={false}
        disabled={!registered}
        value={recipientInput}
        onChange={(e) => {
          setRecipientInput(e.target.value);
          setSent(undefined);
        }}
      />
      {recipientError && (
        <p className='txError fieldMessage'>{recipientError}</p>
      )}
      {recipient && <p className='fieldOk fieldMessage'>Registered member</p>}

      <label htmlFor='transferAmount'>Amount</label>
      <input
        id='transferAmount'
        type='number'
        min='1'
        step='1'
        placeholder='Amount of points'
        disabled={!registered}
        value={amountInput}
        onChange={(e) => {
          setAmountInput(e.target.value);
          setSent(undefined);
        }}
      />
      {amountError && <p className='txError fieldMessage'>{amountError}</p>}

      <button type='submit' className='primaryButton' disabled={!canTransfer}>
        {transferTx.pending ? 'Transferring...' : 'Transfer Points'}
      </button>

      {transferTx.pending && (
        <p className='txHint'>Waiting for confirmation...</p>
      )}
      {transferTx.error && <p className='txError'>{transferTx.error}</p>}
      {sent && (
        <p className='fieldOk txSuccess'>
          Sent {sent.amount.toString()} points to {shortenAddress(sent.to)}.
        </p>
      )}
    </form>
  );
}
