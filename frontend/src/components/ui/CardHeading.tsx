import type { ReactNode } from 'react';

type CardHeadingProps = {
  icon: ReactNode;
  label: string;
  title: string;
  aside?: ReactNode;
};

export function CardHeading({ icon, label, title, aside }: CardHeadingProps) {
  return (
    <div className='cardHeader'>
      <div className='cardTitle'>
        <span className='cardIcon'>{icon}</span>
        <div>
          <p className='cardLabel'>{label}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {aside}
    </div>
  );
}
