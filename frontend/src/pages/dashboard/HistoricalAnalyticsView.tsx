import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  MapPin,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAirQuality } from '../../context/AirQualityContext';
import { api } from '../../services/api';

export const HistoricalAnalyticsView: React.FC = () => {
  const { selectedCity } = useAirQuality();
  const [days, setDays] = useState(7);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [comparisonLocations, setComparisonLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      api.getAnalyticsOverview(selectedCity, days),
      api.compareLocations([selectedCity, 'London', 'Tokyo', 'Delhi'])
    ])
      .then(([overview, comps]) => {
        if (isMounted) {
          setAnalyticsData(overview);
          setComparisonLocations(comps);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCity, days]);

  const handleExportCSV = () => {
    if (!analyticsData || !analyticsData.daily_trend) return;
    const rows = [
      ['Timestamp', 'Date', 'Time', 'AQI', 'PM2.5', 'PM10', 'NO2', 'O3', 'Category'],
      ...analyticsData.daily_trend.map((t: any) => [
        t.timestamp,
        t.date_label,
        t.time_label,
        t.aqi,
        t.pm2_5,
        t.pm10,
        t.no2,
        t.o3,
        t.category
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Historical_Air_Quality_${selectedCity}_${days}Days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Date Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Historical Environmental Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Temporal retrospective & multi-pollutant distribution for <strong>{selectedCity}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Days Filter */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  days === d
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Last {d} Days
              </button>
            ))}
          </div>

          {/* Download CSV button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* METRIC HIGHLIGHTS STRIP */}
      {analyticsData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Mean Period AQI</span>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {analyticsData.avg_aqi}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Average over {days} days</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Peak Pollution Event</span>
            <div className="text-3xl font-black font-mono text-rose-500 mt-1">
              {analyticsData.max_aqi}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Maximum recorded AQI</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Clean Air Hours</span>
            <div className="text-3xl font-black font-mono text-emerald-500 mt-1">
              {analyticsData.clean_air_days}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hours with AQI &le; 50</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Pollution Spikes</span>
            <div className="text-3xl font-black font-mono text-amber-500 mt-1">
              {analyticsData.polluted_days}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Periods exceeding AQI 100</div>
          </div>
        </div>
      )}

      {/* MULTI-POLLUTANT TREND CHART */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historical Particulate Matter Oscillations (PM2.5 vs PM10)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Concentrations measured in µg/m³
            </p>
          </div>
          <BarChart3 className="w-5 h-5 text-blue-500" />
        </div>

        <div className="h-72 w-full pt-4">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Fetching historical records for {selectedCity}...</span>
            </div>
          ) : analyticsData?.daily_trend?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.daily_trend}>
                <defs>
                  <linearGradient id="pm25HistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="pm10HistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="pm2_5" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#pm25HistGrad)" name="PM2.5 (µg/m³)" />
                <Area type="monotone" dataKey="pm10" stroke="#06B6D4" strokeWidth={1.5} fillOpacity={1} fill="url(#pm10HistGrad)" name="PM10 (µg/m³)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
              <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              <span>Historical oscillations will appear as telemetry records accumulate.</span>
            </div>
          )}
        </div>
      </div>

      {/* CROSS-METROPOLIS COMPARISON TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Inter-Metropolis Comparative Benchmarking
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time environmental contrast across global metropolitan hubs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonLocations.map((loc) => (
            <div
              key={loc.city}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{loc.city}</h4>
                  <p className="text-[10px] text-slate-400">{loc.country}</p>
                </div>
                <span
                  style={{ backgroundColor: `${loc.color}20`, color: loc.color, borderColor: `${loc.color}40` }}
                  className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border"
                >
                  AQI {loc.aqi}
                </span>
              </div>

              <div className="text-xs text-slate-500 flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>Dominant: <strong>{loc.dominant_pollutant}</strong></span>
                <span>{loc.temperature_c}°C</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
