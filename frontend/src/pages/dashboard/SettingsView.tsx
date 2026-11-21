import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  MapPin,
  CheckCircle2,
  Save,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAirQuality } from '../../context/AirQualityContext';
import { api } from '../../services/api';

export const SettingsView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedStandard, setSelectedStandard } = useAirQuality();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [city, setCity] = useState(user?.city || 'New York');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [standard, setStandard] = useState(user?.profile?.preferred_aqi_standard || selectedStandard);

  const [emailAlerts, setEmailAlerts] = useState(user?.preferences?.notification_email ?? true);
  const [inAppAlerts, setInAppAlerts] = useState(user?.preferences?.notification_inapp ?? true);
  const [pushAlerts, setPushAlerts] = useState(user?.preferences?.notification_push ?? false);
  const [threshold, setThreshold] = useState(user?.preferences?.aqi_alert_threshold ?? 100);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const updated = await api.updateProfile({
        full_name: fullName,
        city,
        bio,
        phone,
        preferred_aqi_standard: standard,
      });
      await api.updatePreferences({
        notification_email: emailAlerts,
        notification_inapp: inAppAlerts,
        notification_push: pushAlerts,
        aqi_alert_threshold: threshold,
      });
      updateUser(updated);
      setSelectedStandard(standard);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Platform Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, notification thresholds, and default air standards
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* PROFILE SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Default City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                {['New York', 'London', 'Delhi', 'Tokyo', 'Paris', 'Los Angeles', 'Berlin', 'Sydney', 'Mumbai', 'Beijing'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Phone (Optional SMS alerts)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* AIR QUALITY STANDARD & THEME */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scientific Standards & Theme Display
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Default Regional AQI Standard
              </label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="US_EPA">US EPA Standard (0-500 Scale)</option>
                <option value="WHO">WHO 2021 Health Guideline Thresholds</option>
                <option value="EAQI">European Air Quality Index (EAQI)</option>
                <option value="NAQI">Indian National Air Quality Index (NAQI)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Appearance Mode
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION CHANNELS & THRESHOLDS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Notification Channels & Threshold Rules
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  AQI Alert Threshold
                </label>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">
                  Trigger when AQI &gt; {threshold}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Email Morning Briefings & Critical Warnings</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">In-App Popups & Header Badges</span>
                <input
                  type="checkbox"
                  checked={inAppAlerts}
                  onChange={(e) => setInAppAlerts(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Browser Real-Time Push Notifications</span>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Profile...' : 'Save All Preferences'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
