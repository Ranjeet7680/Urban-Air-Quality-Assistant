import React, { useState, useEffect } from 'react';
import {
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
  Radio,
  RefreshCw,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useAirQuality } from '../../context/AirQualityContext';
import { AQIBadge } from '../../components/AQIBadge';
import { AQIGauge } from '../../components/AQIGauge';
import { PollutantCard } from '../../components/PollutantCard';
import { api } from '../../services/api';

interface OverviewViewProps {
  onNavigateTab: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { selectedCity, selectedStandard, airQuality, isLoadingAQ, refreshAQ } = useAirQuality();

  const [hourlyTrend, setHourlyTrend] = useState<any[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const cityGreeting = `${getGreeting()}, ${user?.full_name?.split(' ')[0] || 'Citizen'}. `;
    const briefingText = `${cityGreeting} Here is your atmospheric intelligence briefing for ${selectedCity}. Current Air Quality Index is ${airQuality?.aqi}, categorized as ${airQuality?.aqi_category}. The dominant pollutant is ${airQuality?.dominant_pollutant}. ${airQuality?.health_summary} Surface winds are flowing at ${airQuality?.wind_speed_kmh || 12} kilometers per hour, resulting in moderate dispersion conditions. AirSense AI recommends planning sensitive outdoor activities accordingly.`;

    const utterance = new SpeechSynthesisUtterance(briefingText);
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTrends(true);
    api.getHistory(selectedCity, 1)
      .then((data) => {
        if (isMounted) {
          setHourlyTrend(data.trends || []);
          setIsLoadingTrends(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoadingTrends(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* GREETING & STATUS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Citizen'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your real-time atmospheric intelligence overview for <strong className="text-slate-800 dark:text-slate-200">{selectedCity}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAQ}
            disabled={isLoadingAQ}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAQ ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="font-mono">{airQuality?.last_updated || 'Live Stream Active'}</span>
          </div>
        </div>
      </div>

      {/* MAIN AQI HERO CARD */}
      {airQuality && (
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 shadow-lg">
          <div className="bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Radial AQI Speedometer Gauge & Audio Intelligence */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Air Quality Index ({selectedStandard.replace('_', ' ')})
                  </span>
                  <AQIBadge aqi={airQuality.aqi} category={airQuality.aqi_category} size="md" />
                </div>

                {/* Circular Radial Speedometer Gauge */}
                <AQIGauge
                  aqi={airQuality.aqi}
                  category={airQuality.aqi_category}
                  color={airQuality.aqi_color}
                  dominantPollutant={airQuality.dominant_pollutant}
                />

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center sm:text-left">
                  {airQuality.health_summary}
                </p>

                {/* Audio Briefing Player Widget */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleToggleAudio}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                        isPlayingAudio
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title={isPlayingAudio ? 'Stop Audio Briefing' : 'Listen to Morning Audio Briefing'}
                    >
                      {isPlayingAudio ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Audio Atmospheric Briefing</span>
                        {isPlayingAudio && (
                          <span className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-full bg-blue-500 animate-bounce" />
                            <span className="w-0.5 h-2/3 bg-cyan-500 animate-bounce delay-75" />
                            <span className="w-0.5 h-4/5 bg-emerald-500 animate-bounce delay-150" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isPlayingAudio ? 'Broadcasting live voice summary...' : 'Vocalized atmospheric summary'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <button
                      onClick={() => setAudioSpeed(s => s === 1.0 ? 1.25 : 1.0)}
                      className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold"
                      title="Adjust Speech Speed"
                    >
                      {audioSpeed}x
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateTab('airsense-ai')}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    Ask AirSense AI: "Is it safe to run outdoors?"
                  </button>
                </div>
              </div>

              {/* Right Column: Weather Dispersion Context */}
              <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Microclimatic Dispersion Matrix
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temp
                      </div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                        {airQuality.temperature_c}°C
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Surface ambient</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Humidity
                      </div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                        {airQuality.humidity_percent}%
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Relative vapor</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Wind className="w-3.5 h-3.5 text-blue-500" /> Wind
                      </div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                        {airQuality.wind_speed_kmh} <span className="text-xs font-normal">km/h</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Ventilation factor</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Compass className="w-3.5 h-3.5 text-emerald-500" /> Bearing
                      </div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                        {airQuality.wind_direction_deg}°
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Dispersion vector</div>
                    </div>
                  </div>
                </div>

                {/* Station metadata */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                  <span>Monitor: <strong>{airQuality.station_info?.name}</strong></span>
                  <span>Sensor: <strong>{airQuality.station_info?.sensor_type}</strong></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6 POLLUTANT INDICATOR CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Primary Pollutants & Trace Gases
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated against World Health Organization 2021 Reference Ceiling Guidelines
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('live-aqi')}
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Detailed Telemetry Table <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {airQuality && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {airQuality.pollutants.map((pollutant) => (
              <PollutantCard key={pollutant.pollutant_code} pollutant={pollutant} />
            ))}
          </div>
        )}
      </div>

      {/* 24-HOUR TREND CHART & HEALTH QUICK-SNIPPET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                24-Hour Continuous AQI Oscillations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground sensor assimilation in {selectedCity}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('forecast')}
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              7-Day Forecast <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full pt-4">
            {isLoadingTrends ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading hourly trend data...
              </div>
            ) : hourlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyTrend}>
                  <defs>
                    <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 'dataMax + 20']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#aqiAreaGrad)"
                    name="AQI"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Hourly telemetry stream available.
              </div>
            )}
          </div>
        </div>

        {/* Actionable Health Insight Card */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-blue-800/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AirSense Health Engine
              </span>
            </div>

            <h4 className="text-lg font-bold leading-snug">
              Personalized Recommendations for {user?.full_name?.split(' ')[0] || 'You'}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on today's AQI of {airQuality?.aqi} ({airQuality?.aqi_category}) with wind speed at {airQuality?.wind_speed_kmh} km/h:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                <span>
                  <strong>Workout Safety:</strong> {airQuality?.aqi && airQuality.aqi <= 100 ? 'Safe for outdoor morning runs.' : 'Switch heavy cardio to indoor facilities.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                <span>
                  <strong>Ventilation:</strong> {airQuality?.aqi && airQuality.aqi <= 50 ? 'Open windows for whole-home fresh air exchange.' : 'Keep windows closed during peak commute hours.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                <span>
                  <strong>Respirator Guidance:</strong> {airQuality?.aqi && airQuality.aqi > 100 ? 'N95/KN95 masks advised for cycling commutes.' : 'Standard exposure without mask requirement.'}
                </span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('health')}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            View Full Clinical Health Guidelines
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
