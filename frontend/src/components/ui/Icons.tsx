import type { ReactNode } from 'react';

function Icon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {children}
    </svg>
  );
}

type IconProps = { size?: number };

export function DiceIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <rect x='3' y='3' width='18' height='18' rx='4' />
      <circle cx='8.5' cy='8.5' r='1.2' fill='currentColor' stroke='none' />
      <circle cx='15.5' cy='8.5' r='1.2' fill='currentColor' stroke='none' />
      <circle cx='12' cy='12' r='1.2' fill='currentColor' stroke='none' />
      <circle cx='8.5' cy='15.5' r='1.2' fill='currentColor' stroke='none' />
      <circle cx='15.5' cy='15.5' r='1.2' fill='currentColor' stroke='none' />
    </Icon>
  );
}

export function UserIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <circle cx='12' cy='8' r='4' />
      <path d='M4 21a8 8 0 0 1 16 0' />
    </Icon>
  );
}

export function TransferIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d='M8 3 4 7l4 4' />
      <path d='M4 7h16' />
      <path d='m16 21 4-4-4-4' />
      <path d='M20 17H4' />
    </Icon>
  );
}

export function ShirtIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d='M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' />
    </Icon>
  );
}

export function ShieldIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
    </Icon>
  );
}

export function WalletIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d='M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1' />
      <path d='M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4' />
    </Icon>
  );
}

export function ClockIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v5l3 2' />
    </Icon>
  );
}

export function CheckIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d='M20 6 9 17l-5-5' />
    </Icon>
  );
}

export function CrossIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </Icon>
  );
}
