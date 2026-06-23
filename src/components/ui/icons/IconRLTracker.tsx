interface IconRLTrackerProps {
  size?: number;
  className?: string;
}

export const IconRLTracker = ({ size = 20, className }: IconRLTrackerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path d="M1 13.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1H14V3a.5.5 0 0 0-.5-.5h-2A.5.5 0 0 0 11 3v10H9V6a.5.5 0 0 0-.5-.5h-2A.5.5 0 0 0 6 6v7H4V9a.5.5 0 0 0-.5-.5h-2A.5.5 0 0 0 1 9z" />
    </svg>
  );
};
