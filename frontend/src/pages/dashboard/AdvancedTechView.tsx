import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Radio,
  Satellite,
  Compass,
  Wind,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  Database,
  CheckCircle2,
  Eye,
  Navigation,
  Footprints,
  Bike,
  Car,
  Train
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { api } from '../../services/api';

export const AdvancedTechView: React.FC = () => {
  const { selectedCity, airQuality } = useAirQuality();

  const [sentinelData, setSentinelData] = useState<any>(null);
  const [inversionData, setInversionData] = useState<any>(null);
  const [sourceData, setSourceData] = useState<any>(null);
  const [meshData, setMeshData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive Atmospheric Physics State
  const [calcPm25, setCalcPm25] = useState(28);
  const [calcRh, setCalcRh] = useState(55);
  const [commuteMode, setCommuteMode] = useState('cycling');
  const [commuteRoute, setCommuteRoute] = useState('arterial');
  const [commuteDuration, setCommuteDuration] = useState(30);

  // Koschmieder Atmospheric Optical Extinction Calculation
  const betaRay = 0.012;
  const rhFactor = 1.0 + 0.25 * Math.pow(calcRh / (100.0 - calcRh + 0.01), 0.75);
  const betaPm = 0.003 * calcPm25 * rhFactor;
  const betaExt = betaRay + betaPm + 0.0066;
  const visualRangeKm = Math.min(120, Math.max(1.2, +(3.912 / Math.max(betaExt, 0.001)).toFixed(1)));
  const contrastReductionPct = Math.min(95, +((1.0 - (visualRangeKm / 120.0)) * 100).toFixed(0));

  // Commute Particulate Dosage Calculation
  const currentCityPm25 = airQuality?.pollutants?.find((p: any) => p.pollutant_code === 'pm2_5' || p.pollutant_code === 'pm25')?.concentration || 22.0;
  const ventRates: Record<string, number> = { cycling: 0.035, walking: 0.020, car: 0.010, subway: 0.014 };
  const routeFactors: Record<string, number> = { greenway: 0.65, arterial: 1.25, highway: 1.95 };
  const filterFactors: Record<string, number> = { car: 0.45, subway: 1.25, cycling: 1.0, walking: 1.0 };
  const ventRate = ventRates[commuteMode] || 0.025;
  const routeFactor = routeFactors[commuteRoute] || 1.0;
  const filterFactor = filterFactors[commuteMode] || 1.0;
  const effectivePm25 = +(currentCityPm25 * routeFactor * filterFactor).toFixed(1);
  const totalInhaledAirM3 = +(ventRate * commuteDuration).toFixed(2);
  const totalInhaledPm25Ug = +(effectivePm25 * totalInhaledAirM3).toFixed(1);
  const pctWhoDaily = +((totalInhaledPm25Ug / 15.0) * 100).toFixed(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      api.getSentinel5PData(),
      api.getThermalInversion(selectedCity),
      api.getSourceAttribution(selectedCity),
      api.getLoRaWANMesh(selectedCity),
    ])
      .then(([sentinel, inversion, source, mesh]) => {
        if (isMounted) {
          setSentinelData(sentinel);
          setInversionData(inversion);
          setSourceData(source);
          setMeshData(mesh);
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
  }, [selectedCity]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Advanced Atmospheric Physics & IoT Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Next-Gen Environmental Deep-Tech Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sentinel-5P satellite sounding, boundary layer thermal inversion detection, chemical fingerprinting & LoRaWAN mesh telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Metropolis:</span>
          <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs">
            {selectedCity}
          </span>
        </div>
      </div>

      {/* SECTION 1: SENTINEL-5P SATELLITE TROPOSPHERIC MONITOR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Copernicus Sentinel-5P TROPOMI Satellite Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ESA Tropospheric Column Spectrometer • 824 km Sun-synchronous orbit
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Polar Overpass
          </span>
        </div>

        {sentinelData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sentinelData.products.map((p: any) => (
              <div
                key={p.code}
                className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400">
                    {p.code}
                  </span>
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {p.name}
                  </h4>
                  <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                    {p.mean_val}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                  <span>Hotspot Sinks: </span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{p.risk_areas.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: THERMAL INVERSION DETECTOR & AI SOURCE ATTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Boundary Layer Thermal Inversion */}
        {inversionData && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Thermal Inversion Trap Detector
                  </h3>
                  <p className="text-xs text-slate-500">Planetary Boundary Layer (PBL) Physics</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                inversionData.thermal_inversion_active
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                {inversionData.inversion_strength}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Surface Ground Temp</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {inversionData.surface_temperature_c}°C
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Aloft (500m Atmospheric Lid)</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {inversionData.aloft_500m_temperature_c}°C
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Vertical Mixing Depth</span>
                <div className="text-xl font-bold font-mono text-blue-600 dark:text-cyan-400 mt-1">
                  {inversionData.mixing_layer_height_meters} meters
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Ventilation Trapping Risk</span>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                  {inversionData.ventilation_trapping_risk}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {inversionData.scientific_note}
            </p>
          </div>
        )}

        {/* AI Chemical Source Attribution */}
        {sourceData && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Chemical Source Attribution
                  </h3>
                  <p className="text-xs text-slate-500">Spectral Mass Balance Fingerprinting</p>
                </div>
              </div>

              <span className="text-xs font-mono text-purple-500 font-bold">
                {sourceData.fingerprint_confidence}
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(sourceData.distribution).map(([sourceName, pct]: any) => (
                <div key={sourceName} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{sourceName}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300 leading-relaxed">
              <strong>Municipal Action Recommendation: </strong>
              {sourceData.ai_recommendation}
            </div>
          </div>
        )}

      </div>

      {/* SECTION 3: IOT LORAWAN MICRO-SENSOR MESH */}
      {meshData && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  IoT LoRaWAN Sensor Mesh Telemetry Stream
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Protocol: {meshData.mesh_protocol} • {meshData.active_gateways} Gateways Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Cadence: {meshData.telemetry_duty_cycle}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meshData.nodes.map((node: any) => (
              <div
                key={node.node_id}
                className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    {node.node_id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">RSSI: {node.rssi_dbm} dBm</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{node.name}</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {node.pm25}
                    </span>
                    <span className="text-xs text-slate-400">µg/m³ PM2.5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>Battery: {node.battery_mv} mV</span>
                  <span>Packet Loss: {node.packet_loss_pct}%</span>
                  <span>SNR: +{node.snr_db} dB</span>
                  <span>Calibrated: Yes ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: KOSCHMIEDER OPTICAL VISIBILITY EXTINCTION CALCULATOR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Koschmieder Optical Atmospheric Visibility Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atmospheric Extinction β_ext & Optical Visual Range V_r = 3.912 / β_ext
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
            <span>Visual Horizon: {visualRangeKm} km</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Fine Particulate Loading (PM2.5)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{calcPm25} µg/m³</span>
              </div>
              <input
                type="range"
                min="2"
                max="180"
                value={calcPm25}
                onChange={(e) => setCalcPm25(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Relative Humidity (Hygroscopic Aerosol Swelling)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{calcRh}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={calcRh}
                onChange={(e) => setCalcRh(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Extinction Coeff</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  {betaExt.toFixed(4)} <span className="text-xs font-normal text-slate-400">km⁻¹</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Contrast Reduction</span>
                <span className="text-xl font-black font-mono text-amber-500 mt-1 block">
                  -{contrastReductionPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Simulated Skyline Sightline</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {visualRangeKm >= 35 ? 'Clear Horizon' : visualRangeKm >= 15 ? 'Moderate Haze' : 'Dense Smog'}
              </span>
            </div>

            {/* Visual horizon simulation bar */}
            <div className="relative h-20 rounded-xl overflow-hidden bg-gradient-to-r from-blue-900 via-sky-800 to-amber-700/80 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-slate-200 backdrop-blur-xs transition-opacity duration-300"
                style={{ opacity: Math.min(0.85, contrastReductionPct / 100) }}
              />
              <span className="relative z-10 text-xs font-bold font-mono tracking-wider text-white drop-shadow-md">
                Estimated Visibility: {visualRangeKm} Kilometers
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Rayleigh clean air scattering is 0.012 km⁻¹. When relative humidity exceeds 70%, particulate sulfates and nitrates undergo hygroscopic deliquescence, exponentially magnifying optical light scattering.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: COMMUTE PARTICULATE INHALED DOSAGE SIMULATOR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clean Air Commute Inhaled Dosage Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculates biological lung intake: Dose (µg) = C_effective × V_ventilation × Time
              </p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-200/60 dark:border-cyan-800/60">
            Dose: {totalInhaledPm25Ug} µg PM2.5
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Transit Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cycling', label: 'Cycling', icon: Bike },
                { id: 'walking', label: 'Walking', icon: Footprints },
                { id: 'car', label: 'Car (Cabin HEPA)', icon: Car },
                { id: 'subway', label: 'Subway/Metro', icon: Train }
              ].map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setCommuteMode(m.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      commuteMode === m.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Route Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Route Type</label>
            <div className="space-y-2">
              {[
                { id: 'greenway', label: 'Urban Greenway / Park (0.65x PM)', badge: 'Recommended' },
                { id: 'arterial', label: 'Standard Arterial Boulevard (1.25x)', badge: 'Moderate' },
                { id: 'highway', label: 'High-Density Highway Corridor (1.95x)', badge: 'High Risk' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setCommuteRoute(r.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    commuteRoute === r.id
                      ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">{r.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Inhaled Summary */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Commute Duration</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{commuteDuration} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={commuteDuration}
                onChange={(e) => setCommuteDuration(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Air Inhaled:</span>
                <span className="font-mono font-bold">{totalInhaledAirM3} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Dose:</span>
                <span className="font-mono font-bold text-cyan-500">{totalInhaledPm25Ug} µg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WHO 24h Ceiling:</span>
                <span className="font-mono font-bold text-amber-500">{pctWhoDaily}% of budget</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
