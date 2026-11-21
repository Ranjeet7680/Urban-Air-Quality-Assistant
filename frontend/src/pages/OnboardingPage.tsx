import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wind,
  MapPin,
  Bell,
  HeartPulse,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form states
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [city, setCity] = useState(user?.city || 'New York');
  const [preferredStandard, setPreferredStandard] = useState('US_EPA');
  const [locationPermission, setLocationPermission] = useState(false);
  const [geoStatus, setGeoStatus] = useState<string>('');

  // Notifications
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationInApp, setNotificationInApp] = useState(true);
  const [notificationPush, setNotificationPush] = useState(false);
  const [aqiThreshold, setAqiThreshold] = useState(100);

  // Interests & Health
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Air pollution',
    'Health awareness',
    'Outdoor activities'
  ]);
  const [selectedHealthConditions, setSelectedHealthConditions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableInterests = [
    'Air pollution',
    'Outdoor activities',
    'Health awareness',
    'Environmental research',
    'Urban sustainability',
    'Cycling & Running routes',
    'Pediatric air protection',
    'Clean city advocacy'
  ];

  const availableHealth = [
    'Asthma or reactive airway',
    'Cardiovascular sensitivity',
    'Children / infants at home',
    'Older adults (65+)',
    'Outdoor endurance athlete',
    'Seasonal pollen & dust allergies'
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleHealth = (item: string) => {
    setSelectedHealthConditions(prev =>
      prev.includes(item) ? prev.filter(h => h !== item) : [...prev, item]
    );
  };

  const requestBrowserGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }
    setGeoStatus('Requesting browser location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationPermission(true);
        setGeoStatus(`Location confirmed (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)!`);
      },
      () => {
        setGeoStatus('Permission was denied or unavailable. Default city retained.');
      }
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: fullName || user?.full_name,
        city,
        preferred_aqi_standard: preferredStandard,
        location_permission_granted: locationPermission,
        notification_email: notificationEmail,
        notification_inapp: notificationInApp,
        notification_push: notificationPush,
        aqi_alert_threshold: aqiThreshold,
        interests: selectedInterests,
        health_conditions: selectedHealthConditions,
      };

      const updatedUser = await api.completeOnboarding(payload);
      updateUser(updatedUser);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex flex-col justify-between p-6 sm:p-10 transition-colors">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Step {step} of {totalSteps}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Wizard Card */}
      <div className="max-w-2xl w-full mx-auto my-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl shadow-slate-900/5 relative">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* SCREEN 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Welcome to Urban Air Quality Assistant
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Let's calibrate your environmental dashboard in less than two minutes. We will personalize your air quality standard, sensitive group warnings, and threshold notifications.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Confirm Your Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* SCREEN 2: CITY & STATION SELECTION */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <MapPin className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Select Your Monitoring Metropolis
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose the primary city where you live or want continuous atmospheric tracking.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Primary Location
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['New York', 'London', 'Delhi', 'Tokyo', 'Paris', 'Los Angeles', 'Berlin', 'Sydney', 'Mumbai', 'Beijing'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`p-3 rounded-xl border text-sm font-semibold text-left transition-all cursor-pointer ${
                        city === c
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Air Quality Standard
                </label>
                <select
                  value={preferredStandard}
                  onChange={(e) => setPreferredStandard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="US_EPA">US EPA Standard (0 - 500 Index)</option>
                  <option value="WHO">WHO 2021 Health Guideline Thresholds</option>
                  <option value="EAQI">European Air Quality Index (EAQI)</option>
                  <option value="NAQI">Indian National Air Quality Index (NAQI)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: LOCATION PERMISSIONS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Compass className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Enable Real-Time Geolocation (Optional)
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Allows Urban Air Quality Assistant to automatically detect the nearest reference monitoring station whenever you travel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Browser Geolocation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">High-accuracy coordinate triangulation</p>
                </div>
                <button
                  type="button"
                  onClick={requestBrowserGeolocation}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    locationPermission
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {locationPermission ? 'Permission Granted ✓' : 'Detect Location'}
                </button>
              </div>

              {geoStatus && (
                <div className="text-xs font-medium text-blue-600 dark:text-cyan-400">
                  {geoStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 4: NOTIFICATION PREFERENCES */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bell className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Alerts & Warning Thresholds
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configure when and where our automated monitoring daemon notifies you of pollution spikes.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    AQI Trigger Threshold
                  </label>
                  <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">
                    AQI &gt; {aqiThreshold} ({aqiThreshold <= 50 ? 'Good' : aqiThreshold <= 100 ? 'Moderate' : 'Unhealthy'})
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={aqiThreshold}
                  onChange={(e) => setAqiThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>50 (Sensitive)</span>
                  <span>100 (Moderate Default)</span>
                  <span>150 (Unhealthy)</span>
                  <span>200 (Severe)</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'In-App Alerts & Header Badges', checked: notificationInApp, set: setNotificationInApp },
                  { label: 'Email Morning Air Briefing & Spikes', checked: notificationEmail, set: setNotificationEmail },
                  { label: 'Browser Push Notifications', checked: notificationPush, set: setNotificationPush }
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.set(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 5: INTERESTS & HEALTH PROFILE */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <HeartPulse className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Personalized Health & Research Profile
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                AirSense AI uses this profile to tailor personalized health guidance and workout windows.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Health Considerations (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableHealth.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleHealth(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedHealthConditions.includes(item)
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Your Primary Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedInterests.includes(item)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:opacity-95 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              {isSubmitting ? 'Finalizing Profile...' : 'Open My Dashboard'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      <div className="text-center text-xs text-slate-400">
        Preferences can be customized anytime from Dashboard Settings.
      </div>
    </div>
  );
};
