import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Pollutant } from '../types';

interface PollutantCardProps {
  pollutant: Pollutant;
}

export const PollutantCard: React.FC<PollutantCardProps> = ({ pollutant }) => {
  const isPositiveChange = pollutant.change_24h > 0;
  const isNeutral = pollutant.change_24h === 0;

  // Status badge colors
  let statusBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (pollutant.status === 'Moderate') {
    statusBadge = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  } else if (pollutant.status === 'Unhealthy') {
    statusBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  } else if (pollutant.status === 'Hazardous') {
    statusBadge = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
  }

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {pollutant.pollutant_code.toUpperCase().replace('_', '.')}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge}`}>
              {pollutant.status}
            </span>
          </div>
          <div className="flex items-center text-xs text-slate-400" title={pollutant.standard_note}>
            <Info className="w-3.5 h-3.5 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" />
          </div>
        </div>

        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-1">
          {pollutant.pollutant_name}
        </h4>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            {pollutant.concentration}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {pollutant.unit}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 font-medium">
          {isNeutral ? (
            <span className="text-slate-400 flex items-center gap-0.5">
              <Minus className="w-3.5 h-3.5" /> 0.0% vs 24h
            </span>
          ) : isPositiveChange ? (
            <span className="text-rose-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +{pollutant.change_24h}%
            </span>
          ) : (
            <span className="text-emerald-500 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> {pollutant.change_24h}%
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {pollutant.standard_limit ? `Limit: ${pollutant.standard_limit} ${pollutant.unit}` : 'Standard active'}
        </div>
      </div>
    </div>
  );
};
