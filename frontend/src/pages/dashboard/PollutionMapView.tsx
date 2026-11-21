import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Layers,
  Compass,
  Radio,
  ExternalLink,
  Info,
  Maximize2,
  Navigation
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { useTheme } from '../../context/ThemeContext';
import { AQIBadge } from '../../components/AQIBadge';
import { api } from '../../services/api';
import { MonitoringStation } from '../../types';

export const PollutionMapView: React.FC = () => {
  const { selectedCity, setSelectedCity, airQuality } = useAirQuality();
  const { theme } = useTheme();

  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null);
  const [isLoadingStations, setIsLoadingStations] = useState(true);
  const [searchCityQuery, setSearchCityQuery] = useState('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Load all stations
  useEffect(() => {
    let isMounted = true;
    setIsLoadingStations(true);
    api.getStations()
      .then((data) => {
        if (isMounted) {
          setStations(data);
          setIsLoadingStations(false);
          // Auto select first station of active city
          const cityStation = data.find(s => s.city.toLowerCase() === selectedCity.toLowerCase()) || data[0];
          if (cityStation) setSelectedStation(cityStation);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoadingStations(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet to ensure client-side rendering
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const centerLat = airQuality?.latitude || 40.7128;
        const centerLon = airQuality?.longitude || -74.0060;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLon],
          zoom: 12,
          zoomControl: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Tile layer based on theme (Esri Canvas - zero watermark, high contrast)
        const tileUrl = theme === 'dark'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      } else {
        if (tileLayerRef.current) {
          const tileUrl = theme === 'dark'
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
          tileLayerRef.current.setUrl(tileUrl);
        }
        // Update center if city changes
        if (airQuality?.latitude && airQuality?.longitude) {
          mapInstanceRef.current.flyTo([airQuality.latitude, airQuality.longitude], 12, {
            duration: 1.5,
          });
        }
      }

      // Render markers
      if (markersLayerRef.current && stations.length > 0) {
        markersLayerRef.current.clearLayers();

        stations.forEach((st) => {
          const aqi = st.current_aqi || 45;
          let markerBg = '#16A34A';
          if (aqi > 50 && aqi <= 100) markerBg = '#EAB308';
          else if (aqi > 100 && aqi <= 150) markerBg = '#F97316';
          else if (aqi > 150 && aqi <= 200) markerBg = '#EF4444';
          else if (aqi > 200) markerBg = '#A855F7';

          const customIcon = L.divIcon({
            className: 'custom-aqi-pin',
            html: `
              <div style="background-color: ${markerBg}; box-shadow: 0 4px 14px rgba(0,0,0,0.4);" class="w-9 h-9 rounded-full flex items-center justify-center text-white font-mono font-bold text-xs border-2 border-white cursor-pointer transition-transform duration-200 hover:scale-115">
                ${aqi}
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([st.latitude, st.longitude], { icon: customIcon });
          marker.on('click', () => {
            setSelectedStation(st);
            if (st.city !== selectedCity) {
              setSelectedCity(st.city);
            }
          });
          marker.addTo(markersLayerRef.current);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [theme, stations, selectedCity, airQuality]);

  const mapLegend = [
    { label: '0-50 Good', color: 'bg-emerald-500' },
    { label: '51-100 Moderate', color: 'bg-amber-500' },
    { label: '101-150 Sensitive', color: 'bg-orange-500' },
    { label: '151-200 Unhealthy', color: 'bg-rose-500' },
    { label: '201-300 Very Unhealthy', color: 'bg-purple-500' },
    { label: '301+ Hazardous', color: 'bg-rose-950' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header with Search & Quick Metros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Urban Pollution Map
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Spatial monitoring stations, high-pollution corridors, and clean air pockets
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['New York', 'London', 'Delhi', 'Tokyo', 'Paris'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCity === c
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* MAP CANVAS & FLOATING OVERLAYS */}
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
        
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Top-Left Legend */}
        <div className="absolute top-4 left-4 z-10 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-lg max-w-xs hidden sm:block">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            AQI Map Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
            {mapLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Center Station Card (when marker is clicked) */}
        {selectedStation && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-10 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-3 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
                  {selectedStation.station_code}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {selectedStation.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {selectedStation.city}, {selectedStation.country}
                </p>
              </div>

              {selectedStation.current_aqi && (
                <AQIBadge
                  aqi={selectedStation.current_aqi}
                  category={selectedStation.aqi_category}
                  size="md"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Sensor Type</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedStation.sensor_type}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Operator</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedStation.operator}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Continuous Stream
              </span>

              <button
                onClick={() => setSelectedCity(selectedStation.city)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Focus This City
              </button>
            </div>
          </div>
        )}

      </div>

      {/* STATIONS ROSTER TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ground Station Directory ({stations.length} Active Sensors)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reference photometers & optical beta-attenuation monitors
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Copernicus & Federal Network Synced
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stations.map((st) => (
            <div
              key={st.station_code}
              onClick={() => {
                setSelectedStation(st);
                setSelectedCity(st.city);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedStation?.station_code === st.station_code
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1 min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{st.station_code}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{st.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{st.city}, {st.country}</p>
              </div>

              {st.current_aqi && (
                <AQIBadge aqi={st.current_aqi} category={st.aqi_category} size="sm" showLabel={false} />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
