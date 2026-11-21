import React from 'react';

interface AQIGaugeProps {
  aqi: number;
  category: string;
  color: string;
  dominantPollutant: string;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  category,
  color,
  dominantPollutant
}) => {
  // Clamp AQI between 0 and 500 for gauge representation
  const maxAQI = 350;
  const clampedAQI = Math.min(Math.max(aqi, 0), maxAQI);
  
  // 220 degree arc: from 160 deg to 380 deg (-20 deg)
  const radius = 80;
  const strokeWidth = 12;
  const arcSweepDeg = 220;
  const arcLength = 2 * Math.PI * radius * (arcSweepDeg / 360);
  const fillRatio = clampedAQI / maxAQI;
  const strokeDashoffset = arcLength * (1 - fillRatio);

  // Calculate needle angle (-110 deg at 0 AQI to +110 deg at max AQI)
  const needleAngle = -110 + (fillRatio * 220);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 select-none">
      <svg className="w-56 h-48 -mb-4 overflow-visible" viewBox="0 0 200 170">
        <defs>
          <linearGradient id="aqiGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="25%" stopColor="#EAB308" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="75%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track Arc */}
        <path
          d="M 25 140 A 80 80 0 1 1 175 140"
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-slate-800"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Foreground Colored Arc */}
        <path
          d="M 25 140 A 80 80 0 1 1 175 140"
          fill="none"
          stroke={color || 'url(#aqiGaugeGrad)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          filter="url(#gaugeGlow)"
          className="transition-all duration-1000 ease-out"
        />

        {/* Breakpoint markers & labels */}
        <text x="22" y="158" className="text-[9px] fill-slate-400 font-mono font-bold">0</text>
        <text x="50" y="58" className="text-[9px] fill-slate-400 font-mono font-bold">50</text>
        <text x="94" y="32" className="text-[9px] fill-slate-400 font-mono font-bold">100</text>
        <text x="142" y="58" className="text-[9px] fill-slate-400 font-mono font-bold">150</text>
        <text x="170" y="158" className="text-[9px] fill-slate-400 font-mono font-bold">300+</text>

        {/* Needle Indicator */}
        <g transform={`translate(100, 125) rotate(${needleAngle})`} className="transition-transform duration-1000 ease-out">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-68"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="0" cy="-68" r="4.5" fill="#FFFFFF" stroke={color} strokeWidth="2.5" />
          <circle cx="0" cy="0" r="6" fill={color} />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Central AQI Numerical Display */}
      <div className="text-center -mt-6">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {aqi}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AQI</span>
        </div>
        <div className="text-sm font-bold mt-0.5" style={{ color }}>
          {category}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          Dominant: <strong className="text-slate-700 dark:text-slate-200">{dominantPollutant}</strong>
        </div>
      </div>
    </div>
  );
};
