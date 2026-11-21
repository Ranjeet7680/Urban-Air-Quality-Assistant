import React from 'react';
import {
  HeartPulse,
  Activity,
  Wind,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Baby,
  UserCheck
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { useAuth } from '../../context/AuthContext';
import { AQIBadge } from '../../components/AQIBadge';

export const HealthRecommendationsView: React.FC = () => {
  const { user } = useAuth();
  const { selectedCity, airQuality } = useAirQuality();

  const currentAqi = airQuality?.aqi ?? 45;
  const currentCategory = airQuality?.aqi_category ?? 'Good';

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Environmental Health Guidance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Clinical and preventive public health intelligence for <strong>{selectedCity}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Conditions:</span>
          <AQIBadge aqi={currentAqi} category={currentCategory} size="md" />
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Health Advisory Disclaimer:</strong> Guidance provided is synthesized from World Health Organization (WHO 2021) and US EPA public health benchmarks. This guidance does not constitute formal medical diagnosis or replace personalized consultation with a licensed physician.
        </p>
      </div>

      {/* CORE ACTIONABLE RECOMMENDATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Outdoor Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Outdoor Workouts
            </h3>
            <p className="text-xs text-slate-500 mt-1">Jogging, cycling & cardio</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentAqi <= 50
              ? 'Conditions are optimal for high-intensity outdoor training. Lung uptake of ambient air poses negligible health risk.'
              : currentAqi <= 100
              ? 'Acceptable for most athletes. If performing intense workouts, schedule in the early morning before photochemical ozone peaks.'
              : 'Reduce intense outdoor endurance. Switch heavy cardio indoors with active air purification.'}
          </p>
        </div>

        {/* 2. Ventilation & Windows */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Home Ventilation
            </h3>
            <p className="text-xs text-slate-500 mt-1">Windows & fresh airflow</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentAqi <= 50
              ? 'Open windows across rooms to flush accumulated indoor CO2 and organic volatile compounds.'
              : currentAqi <= 100
              ? 'Natural ventilation is safe during mid-day breeze windows. Close windows during rush-hour traffic peaks.'
              : 'Keep windows sealed. Use mechanical HEPA air cleaners to prevent fine particle ingress.'}
          </p>
        </div>

        {/* 3. Mask & Respirator Protocols */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Respirator Protocols
            </h3>
            <p className="text-xs text-slate-500 mt-1">N95 / FFP2 / KN95</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentAqi <= 100
              ? 'Standard ambient conditions do not require respiratory filtration for the general healthy public.'
              : 'Wear a well-fitted certified N95 or KN95 respirator when walking or commuting near high-traffic arterial roadways.'}
          </p>
        </div>

        {/* 4. Indoor Air Filtration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indoor Air Cleaning
            </h3>
            <p className="text-xs text-slate-500 mt-1">True HEPA H13 standards</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Run air purifiers with true HEPA filters on automated mode in living areas and bedrooms to maintain indoor PM2.5 under 5 µg/m³.
          </p>
        </div>

      </div>

      {/* SENSITIVE GROUP DEMOGRAPHIC GUIDELINES */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Vulnerable Demographics & Sensitive Groups Protocol
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailored physiological defense rules for groups at elevated environmental risk
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Children and Infants */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <Baby className="w-5 h-5 text-blue-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Children & Developing Lungs
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Children breathe 50% more air per pound of body weight than adults, and their airway defenses are still developing. During elevated PM2.5 or Ozone days, limit outdoor recess and vigorous park sports to indoor climate-controlled spaces.
            </p>
          </div>

          {/* Asthmatics & Respiratory */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Asthma & Reactive Airway Disease
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Microscopic particulates trigger bronchial bronchospasms. Keep fast-acting rescue inhalers accessible. If AQI exceeds 100, avoid exercising near diesel bus corridors and monitor peak expiratory flow.
            </p>
          </div>

          {/* Older Adults (65+) */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-purple-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Older Adults (65+)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Vascular elasticity naturally decreases with age, amplifying systemic inflammatory reactions to fine particles. Avoid strenuous gardening or walking when PM2.5 exceeds WHO daily benchmarks.
            </p>
          </div>

          {/* Cardiovascular Health */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Cardiovascular & Hypertension
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Inhaled ultrafine particles (UFP) enter blood circulation, transiently increasing arterial pressure and clotting risk. Maintain hydration and report any chest tightness promptly to your healthcare provider.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
