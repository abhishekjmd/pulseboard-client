import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white ${className}`} {...rest}>
      {children}
    </div>
  );
}
