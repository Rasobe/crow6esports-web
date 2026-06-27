interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl flex-1 px-6 py-24 ${className ?? ""}`}>
      {children}
    </div>
  );
}
