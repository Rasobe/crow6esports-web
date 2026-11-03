import type { ReactNode } from "react";

interface StepGroupProps {
  title: string;
  children: ReactNode;
}

export function StepGroup({ title, children }: StepGroupProps) {
  return (
    <section className="tryouts-group">
      <h3 className="tryouts-group__title">{title}</h3>
      <div className="tryouts-group__fields">{children}</div>
    </section>
  );
}
