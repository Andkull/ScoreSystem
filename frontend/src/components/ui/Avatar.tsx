import type { Address } from 'viem';

// A colour gradient derived from the address, so each account is recognisable.
export function Avatar({ address, size = 40 }: { address: Address; size?: number }) {
  const hueA = parseInt(address.slice(2, 8), 16) % 360;
  const hueB = parseInt(address.slice(8, 14), 16) % 360;
  return (
    <span
      className='avatar'
      aria-hidden='true'
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hueA} 80% 62%), hsl(${hueB} 75% 45%))`,
      }}
    />
  );
}
