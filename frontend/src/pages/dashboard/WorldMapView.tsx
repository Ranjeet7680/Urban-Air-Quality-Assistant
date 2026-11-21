import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Layers,
  Compass,
  Wind,
  Navigation,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Radio,
  Search,
  Maximize2
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { useTheme } from '../../context/ThemeContext';
import { AQIBadge } from '../../components/AQIBadge';
import { api } from '../../services/api';

export const WorldMapView: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { setSelectedCity } = useAirQuality();
  const { theme } = useTheme();

  const [worldData, setWorldData] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any>(null);
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedCityData, setSelectedCityData] = useState<any | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showWindVectors, setShowWindVectors] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);

  const continents = ['All', 'North America', 'Europe', 'Asia', 'Middle East', 'Africa', 'South America', 'Oceania'];

  // Load telemetry
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      api.getWorldMapTelemetry(),
      api.getGlobalRankings(),
    ])
      .then(([telemetry, ranks]) => {
        if (isMounted) {
          setWorldData(telemetry);
          setRankings(ranks);
          setIsLoading(false);
          if (telemetry.length > 0) {
            setSelectedCityData(telemetry[0]);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Global center view
        const map = L.map(mapContainerRef.current, {
          center: [25.0, 15.0],
          zoom: 2.2,
          minZoom: 1.8,
          maxZoom: 16,
          zoomControl: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const tileUrl = theme === 'dark'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        }).addTo(map);

        heatmapLayerRef.current = L.layerGroup().addTo(map);
        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      } else if (tileLayerRef.current) {
        const tileUrl = theme === 'dark'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        tileLayerRef.current.setUrl(tileUrl);
      }

      // Render markers & heatmap circles
      if (markersLayerRef.current && heatmapLayerRef.current && worldData.length > 0) {
        markersLayerRef.current.clearLayers();
        heatmapLayerRef.current.clearLayers();

        const filtered = selectedContinent === 'All'
          ? worldData
          : worldData.filter(d => d.continent === selectedContinent);

        filtered.forEach((city) => {
          // Heatmap dispersion ring
          if (showHeatmap) {
            const radius = Math.max(70000, city.aqi * 1200);
            const circle = L.circle([city.latitude, city.longitude], {
              radius: radius,
              fillColor: city.color,
              fillOpacity: 0.18,
              stroke: false,
            });
            circle.addTo(heatmapLayerRef.current);
          }

          // Custom pin
          const pinHtml = `
            <div style="background-color: ${city.color}; box-shadow: 0 4px 16px ${city.color}80;" class="px-2.5 py-1 rounded-full text-white font-mono font-black text-[11px] border-2 border-white flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-125 whitespace-nowrap">
              <span>${city.city}</span>
              <span class="bg-black/30 px-1 rounded">${city.aqi}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            className: 'world-aqi-pill',
            html: pinHtml,
            iconSize: [80, 26],
            iconAnchor: [40, 13],
          });

          const marker = L.marker([city.latitude, city.longitude], { icon: customIcon });
          marker.on('click', () => {
            setSelectedCityData(city);
            mapInstanceRef.current.flyTo([city.latitude, city.longitude], 6, { duration: 1.2 });
          });
          marker.addTo(markersLayerRef.current);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [theme, worldData, selectedContinent, showHeatmap]);

  const handleFocusContinent = (cont: string) => {
    setSelectedContinent(cont);
    if (!mapInstanceRef.current) return;

    const coordinatesMap: Record<string, [number, number, number]> = {
      'All': [25.0, 15.0, 2.2],
      'North America': [40.0, -98.0, 3.5],
      'Europe': [50.0, 15.0, 4.0],
      'Asia': [30.0, 100.0, 3.2],
      'Middle East': [26.0, 45.0, 4.2],
      'Africa': [2.0, 20.0, 3.2],
      'South America': [-18.0, -60.0, 3.2],
      'Oceania': [-25.0, 135.0, 3.8],
    };

    const target = coordinatesMap[cont] || [25.0, 15.0, 2.2];
    mapInstanceRef.current.flyTo([target[0], target[1]], target[2], { duration: 1.5 });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Continent Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Planetary Surveillance Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Real-Time AQI World Atmosphere Map
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transboundary particulate dispersion, satellite aerosol tracking, and planetary rankings
          </p>
        </div>

        {/* Global Overview Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFocusContinent('All')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>World Overview</span>
          </button>
        </div>
      </div>

      {/* CONTINENT SELECTOR PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {continents.map((c) => (
          <button
            key={c}
            onClick={() => handleFocusContinent(c)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedContinent === c
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* GLOBAL LEADERBOARD STRIP */}
      {rankings && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Top 5 Cleanest */}
          <div className="lg:col-span-6 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-500" /> Cleanest Global Megacities Today
              </span>
              <span className="text-[10px] text-slate-400">WHO compliant</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {rankings.cleanest.map((c: any) => (
                <button
                  key={c.city}
                  onClick={() => {
                    setSelectedCityData(c);
                    mapInstanceRef.current.flyTo([c.latitude, c.longitude], 7, { duration: 1.2 });
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                >
                  <span>{c.city}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{c.aqi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top 5 Most Polluted */}
          <div className="lg:col-span-6 p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-500" /> Severe Pollution Alerts Active
              </span>
              <span className="text-[10px] text-rose-400">High Risk</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {rankings.most_polluted.map((c: any) => (
                <button
                  key={c.city}
                  onClick={() => {
                    setSelectedCityData(c);
                    mapInstanceRef.current.flyTo([c.latitude, c.longitude], 7, { duration: 1.2 });
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                >
                  <span>{c.city}</span>
                  <span className="text-rose-500 font-mono font-bold">{c.aqi}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FULL WORLD MAP CANVAS */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900">
        
        {/* Leaflet DOM element */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Layer Controls */}
        <div className="absolute top-4 left-4 z-10 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Map Atmospheric Overlays
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Aerosol Heatmap Rings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showWindVectors}
                onChange={(e) => setShowWindVectors(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Wind Vector Streamlines</span>
            </label>
          </div>
        </div>

        {/* Floating City Inspector HUD Card */}
        {selectedCityData && (
          <div className="absolute bottom-6 right-6 z-10 p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-84 sm:w-96 space-y-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400">
                  {selectedCityData.continent}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedCityData.city}
                </h3>
                <p className="text-xs text-slate-500">{selectedCityData.country}</p>
              </div>

              <AQIBadge aqi={selectedCityData.aqi} category={selectedCityData.category} size="md" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400">PM2.5</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{selectedCityData.pm25} µg/m³</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400">Wind Velocity</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{selectedCityData.wind_speed_kmh} km/h</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400">Satellite AOD</span>
                <div className="font-mono font-bold text-cyan-500 mt-0.5">{selectedCityData.satellite_aod}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCityData.health_summary}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedCity(selectedCityData.city);
                  if (onNavigateTab) onNavigateTab('overview');
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                <span>Focus City</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSelectedCity(selectedCityData.city);
                  if (onNavigateTab) onNavigateTab('airsense-ai');
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="Consult AI about this city"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>AI</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
