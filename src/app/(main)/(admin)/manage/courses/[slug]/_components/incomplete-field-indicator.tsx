"use client";

type IncompleteFieldIndicatorProps = {
  completed: boolean;
};

export const IncompleteFieldIndicator = ({
  completed,
}: IncompleteFieldIndicatorProps) => {
  return (
    !completed && (
      <span className="absolute left-0 top-0 -ml-0.5 -mt-0.5 flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
      </span>
    )
  );
};
