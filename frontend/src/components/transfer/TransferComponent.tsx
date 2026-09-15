import { useState, type FormEvent } from 'react';
import { isAddress, isAddressEqual, type Address } from 'viem';
import {
  transferPoints,
  type PlayerData,
} from '../../blockchain/contractFunctions';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useTransaction } from '../../hooks/useTransaction';
import { shortenAddress } from '../../utils/format';

type TransferProps = {
  address?: Address;
  player?: PlayerData;
  onTransferred: () => void;
};

// Whole number of points greater than zero, or undefined if invalid.
function parseAmount(value: string) {
  if (!/^\d+$/.test(value)) return undefined;
  const amount = BigInt(value);
  return amount > 0n ? amount : undefined;
}

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

  const recipientText = recipientInput.trim();
  const recipient = isAddress(recipientText) ? recipientText : undefined;
  const isSelf = Boolean(
    recipient && address && isAddressEqual(recipient, address),
  );
  // Look up the receiver once a full, valid address has been entered.
  const { player: recipientData } = usePlayerData(
    isSelf ? undefined : recipient,
  );

  const amountText = amountInput.trim();
  const amount = parseAmount(amountText);

  let recipientError: string | undefined;
  if (recipientText && !recipient) {
    recipientError = 'Enter a valid address (0x followed by 40 hex characters).';
  } else if (isSelf) {
    recipientError = "That's your own address.";
  } else if (recipientData && !recipientData.registered) {
    recipientError = "This address isn't a registered member.";
  }

  let amountError: string | undefined;
  if (amountText && amount === undefined) {
    amountError = 'Enter a whole number of points greater than 0.';
  } else if (amount !== undefined && amount > score) {
    amountError = `You only have ${score.toString()} points.`;
  }

  const canTransfer =
    registered &&
    recipientData?.registered === true &&
    !isSelf &&
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
    <form className='card transferCard' onSubmit={handleTransfer}>
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
      {recipientData?.registered && !isSelf && (
        <p className='fieldOk fieldMessage'>Registered member</p>
      )}

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
