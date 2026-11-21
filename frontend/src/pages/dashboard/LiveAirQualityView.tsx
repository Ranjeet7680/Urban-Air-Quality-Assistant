import React from 'react';
import {
  Activity,
  Layers,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  Compass
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { AQIBadge } from '../../components/AQIBadge';

export const LiveAirQualityView: React.FC = () => {
  const { selectedCity, selectedStandard, setSelectedStandard, airQuality, isLoadingAQ } = useAirQuality();

  const standardsInfo = {
    US_EPA: {
      name: 'United States EPA AQI',
      range: '0 - 500',
      description: 'Established under the Clean Air Act, dividing air pollution into six color-coded severity brackets.'
    },
    WHO: {
      name: 'World Health Organization 2021 Guidelines',
      range: 'Direct Health Ceilings (µg/m³)',
      description: 'Stringent evidence-based guideline limits for annual and 24-hour mean human exposure.'
    },
    EAQI: {
      name: 'European Air Quality Index (EAQI)',
      range: '1 (Very Good) to 6 (Extremely Poor)',
      description: 'Used across EEA member states with focus on PM2.5, PM10, NO2, and Ozone concentrations.'
    },
    NAQI: {
      name: 'Indian National Air Quality Index (NAQI)',
      range: '0 - 500 Sub-indices',
      description: 'Formulated by CPCB with customized breakpoints for high-dust subtropical atmospheres.'
    }
  };

  const aqiCategories = [
    { range: '0 - 50', name: 'Good', color: 'bg-emerald-500', meaning: 'Satisfactory air quality. Little to no health risk.' },
    { range: '51 - 100', name: 'Moderate', color: 'bg-amber-500', meaning: 'Acceptable; unusually sensitive individuals may experience mild respiratory cough.' },
    { range: '101 - 150', name: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', meaning: 'Children, older adults, and asthmatics are at heightened risk of adverse symptoms.' },
    { range: '151 - 200', name: 'Unhealthy', color: 'bg-rose-500', meaning: 'General public begins to experience health effects; sensitive members suffer acute symptoms.' },
    { range: '201 - 300', name: 'Very Unhealthy', color: 'bg-purple-500', meaning: 'Health alert: significant increase in biological respiratory inflammation for everyone.' },
    { range: '301 - 500', name: 'Hazardous', color: 'bg-rose-950', meaning: 'Emergency advisory: whole urban population likely affected. Avoid all outdoor exertion.' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Standard Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Air Quality Telemetry & Standards
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Certified atmospheric measurements for <strong>{selectedCity}</strong>
          </p>
        </div>

        {/* Standard Picker */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {Object.keys(standardsInfo).map((stdKey) => (
            <button
              key={stdKey}
              onClick={() => setSelectedStandard(stdKey)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedStandard === stdKey
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {stdKey.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Standard Explanation Box */}
      <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl p-5 space-y-1">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-blue-900 dark:text-cyan-300">
            {standardsInfo[selectedStandard as keyof typeof standardsInfo]?.name}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-mono font-semibold">
            {standardsInfo[selectedStandard as keyof typeof standardsInfo]?.range}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
          {standardsInfo[selectedStandard as keyof typeof standardsInfo]?.description}
        </p>
      </div>

      {/* Category Breakpoints Reference */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Regional AQI Category Classification Scale
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {aqiCategories.map((cat) => (
            <div
              key={cat.name}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">{cat.range}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {cat.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED POLLUTANT TELEMETRY TABLE */}
      {airQuality && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Physical Sensor Telemetry Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data source: {airQuality.data_source} | Observation: {airQuality.last_updated}
              </p>
            </div>
            <AQIBadge aqi={airQuality.aqi} category={airQuality.aqi_category} size="md" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-6 font-bold">Pollutant</th>
                  <th className="py-3 px-6 font-bold">Observed Concentration</th>
                  <th className="py-3 px-6 font-bold">Sub-Index (EPA)</th>
                  <th className="py-3 px-6 font-bold">24h Variance</th>
                  <th className="py-3 px-6 font-bold">WHO 2021 Reference Ceiling</th>
                  <th className="py-3 px-6 font-bold">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {airQuality.pollutants.map((p) => {
                  const whoRatio = p.standard_limit ? (p.concentration / p.standard_limit).toFixed(1) : '1.0';
                  return (
                    <tr key={p.pollutant_code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                        <div className="font-bold">{p.pollutant_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.pollutant_code.toUpperCase().replace('_', '.')}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-base text-slate-900 dark:text-white">
                        {p.concentration} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {p.sub_index ?? 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-mono font-semibold ${
                          p.change_24h > 0 ? 'text-rose-500' : p.change_24h < 0 ? 'text-emerald-500' : 'text-slate-400'
                        }`}>
                          {p.change_24h > 0 ? `+${p.change_24h}%` : `${p.change_24h}%`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                        {p.standard_limit ? (
                          <div>
                            <span className="font-mono">{p.standard_limit} {p.unit}</span>
                            <span className="ml-2 text-[10px] text-slate-400">({whoRatio}x limit)</span>
                          </div>
                        ) : 'Reference'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          p.status === 'Good' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                          p.status === 'Moderate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STATION PROFILES & HARDWARE CALIBRATION METADATA */}
      {airQuality?.station_info && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Ground Station Metadata & Calibration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">Station Identifier</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {airQuality.station_info.station_code}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{airQuality.station_info.name}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">Operating Authority</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {airQuality.station_info.operator}
              </div>
              <div className="text-[10px] text-emerald-500 mt-0.5">Continuous Compliance Sync</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">Sensor Architecture</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {airQuality.station_info.sensor_type}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Beta-ray Laser & Spectrometry</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">Elevation & Status</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {airQuality.station_info.elevation}m Altitude
              </div>
              <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">
                ● Status: {airQuality.station_info.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
