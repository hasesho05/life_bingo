import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = (props: MainLayoutProps) => {
  return (
    <div className="min-h-dvh bg-off-white">
      {props.children}
    </div>
  );
};
