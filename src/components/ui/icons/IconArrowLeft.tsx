interface IconArrowLeftProps {
  size?: number;
  className?: string;
}

export const IconArrowLeft = ({ size = 14, className }: IconArrowLeftProps) => {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
};
