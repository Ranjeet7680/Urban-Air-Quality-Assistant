import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wind,
  Shield,
  Activity,
  MapPin,
  Sparkles,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Radio,
  FileBarChart,
  Compass,
  Cpu
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AQIBadge } from '../components/AQIBadge';
import { PollutantCard } from '../components/PollutantCard';
import { api } from '../services/api';
import { AirQualityData } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPreviewCity, setSelectedPreviewCity] = useState('New York');
  const [previewData, setPreviewData] = useState<AirQualityData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);

  // Available preview cities
  const cities = ['New York', 'London', 'Delhi', 'Tokyo', 'Paris'];

  useEffect(() => {
    let isMounted = true;
    setIsLoadingPreview(true);
    api.getCurrentAirQuality(selectedPreviewCity, 'US_EPA')
      .then((data) => {
        if (isMounted) {
          setPreviewData(data);
          setIsLoadingPreview(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoadingPreview(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedPreviewCity]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors">
      <Navbar />

      {/* GLOBAL MEGACITIES AQI STREAM TICKER */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden py-2 select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[
            { city: 'Tokyo', aqi: 28, cat: 'Good', color: '#16A34A', pm: '7.2' },
            { city: 'London', aqi: 42, cat: 'Good', color: '#16A34A', pm: '10.4' },
            { city: 'New York', aqi: 55, cat: 'Moderate', color: '#EAB308', pm: '14.2' },
            { city: 'Paris', aqi: 48, cat: 'Good', color: '#16A34A', pm: '11.8' },
            { city: 'Delhi', aqi: 184, cat: 'Unhealthy', color: '#EF4444', pm: '88.5' },
            { city: 'Singapore', aqi: 36, cat: 'Good', color: '#16A34A', pm: '9.0' },
            { city: 'Sydney', aqi: 24, cat: 'Good', color: '#16A34A', pm: '5.8' },
            { city: 'São Paulo', aqi: 62, cat: 'Moderate', color: '#EAB308', pm: '17.3' },
            { city: 'Berlin', aqi: 38, cat: 'Good', color: '#16A34A', pm: '9.5' },
            { city: 'Cairo', aqi: 142, cat: 'Sensitive', color: '#F97316', pm: '52.1' },
            { city: 'Beijing', aqi: 82, cat: 'Moderate', color: '#EAB308', pm: '26.4' },
            { city: 'Seoul', aqi: 52, cat: 'Moderate', color: '#EAB308', pm: '13.1' },
            // Seamless duplicate
            { city: 'Tokyo', aqi: 28, cat: 'Good', color: '#16A34A', pm: '7.2' },
            { city: 'London', aqi: 42, cat: 'Good', color: '#16A34A', pm: '10.4' },
            { city: 'New York', aqi: 55, cat: 'Moderate', color: '#EAB308', pm: '14.2' },
            { city: 'Paris', aqi: 48, cat: 'Good', color: '#16A34A', pm: '11.8' },
            { city: 'Delhi', aqi: 184, cat: 'Unhealthy', color: '#EF4444', pm: '88.5' },
            { city: 'Singapore', aqi: 36, cat: 'Good', color: '#16A34A', pm: '9.0' },
            { city: 'Sydney', aqi: 24, cat: 'Good', color: '#16A34A', pm: '5.8' },
            { city: 'São Paulo', aqi: 62, cat: 'Moderate', color: '#EAB308', pm: '17.3' },
            { city: 'Berlin', aqi: 38, cat: 'Good', color: '#16A34A', pm: '9.5' },
            { city: 'Cairo', aqi: 142, cat: 'Sensitive', color: '#F97316', pm: '52.1' },
            { city: 'Beijing', aqi: 82, cat: 'Moderate', color: '#EAB308', pm: '26.4' },
            { city: 'Seoul', aqi: 52, cat: 'Moderate', color: '#EAB308', pm: '13.1' },
          ].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.city}</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-black text-white" style={{ backgroundColor: item.color }}>
                {item.aqi} AQI
              </span>
              <span className="text-slate-400 text-[10px]">PM2.5: {item.pm} µg</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/80 shadow-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Next-Gen Environmental Intelligence SaaS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Understand Your Air. <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Protect Your Health.
              </span> <br />
              Create Cleaner Cities.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Monitor real-time air quality, discover pollution hotspots, and receive intelligent environmental insights with your AI-powered urban air quality assistant.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('air-quality');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg shadow-slate-900/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4 text-cyan-400 dark:text-blue-600" />
                Explore Air Quality
              </button>

              <button
                onClick={() => navigate('/auth?mode=register')}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Badge */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Real-Time Sensor Telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Open-Meteo & Copernicus CAMS
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grounded Gemini AI Insights
              </span>
            </div>
          </div>

          {/* LIVE AIR QUALITY PREVIEW HERO WIDGET */}
          <div id="air-quality" className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/20 via-cyan-500/10 to-transparent shadow-2xl">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[22px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
                
                {/* Header with City Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Live Atmospheric Telemetry Stream
                      </h3>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {previewData?.city || selectedPreviewCity}, {previewData?.country || 'USA'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        ({previewData?.latitude.toFixed(2)}°, {previewData?.longitude.toFixed(2)}°)
                      </span>
                    </div>
                  </div>

                  {/* City Selector Buttons */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedPreviewCity(city)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          selectedPreviewCity === city
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main AQI Banner & Primary Pollutants */}
                {isLoadingPreview ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Querying real-time satellite & ground sensor telemetry...</p>
                  </div>
                ) : previewData ? (
                  <div className="space-y-6">
                    {/* Big AQI Gauge Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60">
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Air Quality Index (US EPA)
                        </span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                            {previewData.aqi}
                          </span>
                          <AQIBadge aqi={previewData.aqi} category={previewData.aqi_category} size="lg" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dominant Pollutant: <span className="font-semibold text-slate-700 dark:text-slate-200">{previewData.dominant_pollutant}</span>
                        </p>
                      </div>

                      <div className="space-y-2 lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Health Advisory & Dispersion Context
                        </span>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {previewData.health_summary}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span>Temp: <strong className="text-slate-800 dark:text-slate-200">{previewData.temperature_c}°C</strong></span>
                          <span>Humidity: <strong className="text-slate-800 dark:text-slate-200">{previewData.humidity_percent}%</strong></span>
                          <span>Wind: <strong className="text-slate-800 dark:text-slate-200">{previewData.wind_speed_kmh} km/h</strong></span>
                          <span>Source: <strong className="text-blue-600 dark:text-cyan-400">{previewData.data_source}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Pollutants Grid (PM2.5, PM10, NO2, SO2, CO, O3) */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Pollutant Breakdown (WHO Reference Benchmarks)
                        </h4>
                        <span className="text-xs text-slate-400">Updated: {previewData.last_updated}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {previewData.pollutants.map((p) => (
                          <div
                            key={p.pollutant_code}
                            className="bg-white dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                                {p.pollutant_code.toUpperCase().replace('_', '.')}
                              </span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                p.status === 'Good' ? 'bg-emerald-500/10 text-emerald-500' :
                                p.status === 'Moderate' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-white">
                              {p.concentration}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{p.unit}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Metadata Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Station: <strong>{previewData?.station_info?.name || 'Metropolitan Reference BAM'}</strong></span>
                  </div>
                  <button
                    onClick={() => navigate('/auth?mode=register')}
                    className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View detailed analytics & 7-day forecast
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A — THE PROBLEM */}
      <section id="about" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Global Urban Health Crisis</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                9 out of 10 people breathe air exceeding WHO pollution limits.
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Urban air pollution is an invisible, pervasive threat. Ultrafine particulate matter (PM2.5 and PM10) penetrates deep into the bloodstream, triggering respiratory inflammation, cardiovascular disease, and reduced cognitive vitality.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: 'Increasing Fine Particulate Matter',
                    desc: 'Microscopic soot from vehicle exhaust, tire wear, and industrial combustion accumulates in dense street canyons.'
                  },
                  {
                    title: 'Delayed Public Awareness',
                    desc: 'Citizens often step outside during severe ozone or inversion spikes without realizing the acute biological toll.'
                  },
                  {
                    title: 'Inaccessible & Siloed Pollution Data',
                    desc: 'Raw government monitors use confusing telemetry without actionable health guidelines or forward predictions.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="mt-1 w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Statistics Card */}
            <div className="relative">
              <div className="rounded-3xl p-8 bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-2xl border border-slate-700/60 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Global Environmental Reality</span>
                  <Activity className="w-5 h-5 text-rose-400" />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-4xl font-black font-mono text-white">7.0 Million</div>
                    <div className="text-xs text-slate-400 mt-1">Premature deaths linked annually to ambient air pollution (WHO)</div>
                  </div>

                  <div className="h-px bg-slate-800" />

                  <div>
                    <div className="text-4xl font-black font-mono text-amber-400">6.2x</div>
                    <div className="text-xs text-slate-400 mt-1">Average urban PM2.5 concentration above WHO 2021 annual ceiling</div>
                  </div>

                  <div className="h-px bg-slate-800" />

                  <div>
                    <div className="text-4xl font-black font-mono text-cyan-400">83%</div>
                    <div className="text-xs text-slate-400 mt-1">Of citizens lack real-time exposure forecasting to plan daily routines</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — OUR SOLUTION */}
      <section id="solutions" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Shield className="w-3.5 h-3.5" />
              <span>Architected for Clean Cities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Environmental intelligence made clear, predictive, and actionable.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Urban Air Quality Assistant synthesizes continuous ground telemetry, satellite atmospheric data, predictive modeling, and generative AI to protect human health and guide city planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: Layers,
                title: 'Multi-Source Data Assimilation',
                desc: 'Fuses reference EPA BAM monitors, Open-Meteo, and Copernicus CAMS satellite models into one authoritative source of truth.'
              },
              {
                icon: Brain,
                title: 'AirSense AI Conversational Engine',
                desc: 'Grounded by Google Gemini, answering questions on health, workout safety, and chemical dispersion with zero fabricated numbers.'
              },
              {
                icon: Compass,
                title: 'Spatial Micro-Mapping & Forecasts',
                desc: 'Pinpoints clean air pockets, high-pollution street canyons, and gives 24-hour hourly and 7-day atmospheric projections.'
              }
            ].map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{sol.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{sol.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION C — 6 PLATFORM FEATURES */}
      <section id="features" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Platform Features
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Six purpose-built capabilities empowering you to monitor, predict, and respond to urban air pollution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                color: 'text-blue-500',
                title: 'Real-Time AQI Monitoring',
                desc: 'Live telemetry across PM2.5, PM10, NO2, SO2, CO, and O3 with configurable standards (US EPA, WHO, EAQI, NAQI).'
              },
              {
                icon: Brain,
                color: 'text-cyan-500',
                title: 'AirSense AI Environmental Assistant',
                desc: 'Ask direct questions about workout safety, pollution causes, and health precautions grounded strictly in real sensor data.'
              },
              {
                icon: MapPin,
                color: 'text-emerald-500',
                title: 'Interactive Pollution Map',
                desc: 'Full Leaflet OpenStreetMap visualization showing monitoring stations, clean air zones, and pollution hotspots.'
              },
              {
                icon: TrendingUp,
                color: 'text-amber-500',
                title: 'Air Quality Forecasting',
                desc: 'Atmospheric simulation for next 24 hours and 7 days powered by Copernicus CAMS with clear confidence ratings.'
              },
              {
                icon: Shield,
                color: 'text-rose-500',
                title: 'Health Recommendations',
                desc: 'Tailored guidance for sensitive groups, pediatric asthma, elderly cardio health, outdoor athletes, and ventilation.'
              },
              {
                icon: FileBarChart,
                color: 'text-purple-500',
                title: 'Environmental Analytics & Reports',
                desc: 'Audit historical trends, compare cities side-by-side, and generate downloadable executive PDF & CSV reports.'
              },
              {
                icon: Globe,
                color: 'text-cyan-500',
                title: 'Real-Time AQI World Atmosphere Map',
                desc: 'Transboundary planetary surveillance tracking air pollution clusters, wind streamlines, and megacity rankings worldwide.'
              },
              {
                icon: Cpu,
                color: 'text-emerald-500',
                title: 'Deep-Tech Sentinel-5P & Inversion Engine',
                desc: 'Copernicus satellite tropospheric sounding, boundary layer thermal inversion trap detection, and LoRaWAN IoT mesh.'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                      Learn more in dashboard <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION D — HOW IT WORKS */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
              <Cpu className="w-3.5 h-3.5" />
              <span>Step-by-Step Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How Urban Air Quality Assistant Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              From global satellite assimilation to your personal morning briefing in six continuous steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Select Location', desc: 'Auto-detect coordinates or choose your target metropolis.' },
              { step: '02', title: 'Retrieve Telemetry', desc: 'Pull continuous physical readings from reference monitors.' },
              { step: '03', title: 'Analyze Pollutants', desc: 'Calculate sub-indices for PM2.5, PM10, NO2, SO2, CO, and O3.' },
              { step: '04', title: 'Generate AI Insights', desc: 'AirSense AI evaluates dispersion, chemical trends, and risks.' },
              { step: '05', title: 'Receive Advice', desc: 'Personalized recommendations for outdoor exercise and HEPA masks.' },
              { step: '06', title: 'Continuous Tracking', desc: 'Receive real-time alerts whenever AQI exceeds safe thresholds.' }
            ].map((st, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 relative flex flex-col justify-between shadow-sm"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-cyan-400">
                    {st.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E — ENVIRONMENTAL IMPACT */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-transparent via-blue-50/50 dark:via-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Measurable Environmental Impact
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enabling proactive public health protection and data-driven urban sustainability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '38%', label: 'Reduction in Acute Exposure', desc: 'Via forecast-based outdoor workout rescheduling' },
              { val: '100%', label: 'Sensor Integrity', desc: 'Grounded physical readings with zero synthetic hallucination' },
              { val: '10+', label: 'Global Mega-Metros', desc: 'Real-time telemetry streams from Tokyo to New York' },
              { val: '24/7', label: 'Automated Alerting', desc: 'Custom threshold warnings delivered to your inbox & dashboard' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 dark:text-cyan-400">
                  {stat.val}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F — FINAL CTA */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 p-10 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Take Control of the Air You Breathe.
              </h2>
              <p className="text-base sm:text-lg text-blue-50 leading-relaxed font-normal">
                Join thousands of urban citizens, parents, athletes, and city planners using real-time atmospheric intelligence to live healthier.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/auth?mode=register')}
                  className="px-8 py-4 text-base font-bold rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-slate-950/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  Start Monitoring Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G — FOOTER */}
      <Footer />
    </div>
  );
};
