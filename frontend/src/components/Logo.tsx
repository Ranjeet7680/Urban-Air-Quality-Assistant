import React from 'react';
import { Wind, Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold transition-transform duration-300 hover:scale-105`}>
          <Wind className="w-5 h-5 text-white stroke-[2.2]" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${titleSizes[size]}`}>
            Urban<span className="text-blue-600 dark:text-cyan-400">Air</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/60">
            AI SaaS
          </span>
        </div>
        {showTagline && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Breathe Smarter. Live Healthier.
          </p>
        )}
      </div>
    </div>
  );
};
