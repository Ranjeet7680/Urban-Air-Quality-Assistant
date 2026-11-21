import React from 'react';

interface AQIBadgeProps {
  aqi: number;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AQIBadge: React.FC<AQIBadgeProps> = ({ aqi, category, size = 'md', showLabel = true }) => {
  // Determine standard color palette
  let bgColor = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-500';
  let catName = category || 'Good';

  if (aqi <= 50) {
    bgColor = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500';
    catName = category || 'Good';
  } else if (aqi <= 100) {
    bgColor = 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
    catName = category || 'Moderate';
  } else if (aqi <= 150) {
    bgColor = 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-500';
    catName = category || 'Sensitive Groups';
  } else if (aqi <= 200) {
    bgColor = 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500';
    catName = category || 'Unhealthy';
  } else if (aqi <= 300) {
    bgColor = 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
    dotColor = 'bg-purple-500';
    catName = category || 'Very Unhealthy';
  } else {
    bgColor = 'bg-red-950/40 text-rose-300 border-rose-900';
    dotColor = 'bg-rose-900';
    catName = category || 'Hazardous';
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2 font-medium',
    lg: 'text-base px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${bgColor} ${sizeStyles[size]}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
      <span className="font-bold">{aqi}</span>
      {showLabel && <span className="opacity-90">{catName}</span>}
    </span>
  );
};
