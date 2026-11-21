import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Send,
  Trash2,
  Sparkles,
  ShieldAlert,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AlertsView: React.FC = () => {
  const { user } = useAuth();
  const { alerts, markAlertRead, markAllAlertsRead, refreshAlerts } = useAirQuality();

  const [threshold, setThreshold] = useState<number>(user?.preferences?.aqi_alert_threshold || 100);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(user?.preferences?.notification_email ?? true);
  const [inAppAlerts, setInAppAlerts] = useState<boolean>(user?.preferences?.notification_inapp ?? true);
  const [pushAlerts, setPushAlerts] = useState<boolean>(user?.preferences?.notification_push ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess('');
    try {
      await api.updatePreferences({
        aqi_alert_threshold: threshold,
        notification_email: emailAlerts,
        notification_inapp: inAppAlerts,
        notification_push: pushAlerts,
      });
      setSaveSuccess('Alert configuration updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTrigger = async () => {
    setIsTriggering(true);
    try {
      await api.triggerTestAlert();
      await refreshAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Automated Environmental Alerts & Thresholds
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time threshold surveillance and proactive notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestTrigger}
            disabled={isTriggering}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTriggering ? 'Dispatching...' : 'Trigger Test Alert'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE ALERTS FEED */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active & Recent Alert Log
              </h3>
              <p className="text-xs text-slate-500">
                Sorted chronologically by trigger time
              </p>
            </div>
            {alerts.some(a => !a.is_read) && (
              <button
                onClick={markAllAlertsRead}
                className="text-xs text-blue-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No active pollution alerts. Your atmospheric envelope is currently within normal bounds.
              </div>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => markAlertRead(a.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    a.is_read
                      ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-75'
                      : 'border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        a.severity === 'critical' ? 'bg-rose-500' : a.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {a.title}
                      </h4>
                    </div>

                    {a.aqi_value && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shrink-0">
                        AQI {a.aqi_value}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {a.message}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Location: <strong>{a.location_name}</strong></span>
                    <span>{new Date(a.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: NOTIFICATION SETTINGS FORM */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Surveillance Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize threshold triggers and alert channels
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  AQI Spike Threshold
                </label>
                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">
                  &gt; {threshold}
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
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50 (Sensitive)</span>
                <span>100 (Moderate)</span>
                <span>150 (Unhealthy)</span>
                <span>200 (Severe)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Notification Delivery Channels
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">In-App Notifications</div>
                    <div className="text-[10px] text-slate-400">Bell popover & dashboard banners</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={inAppAlerts}
                  onChange={(e) => setInAppAlerts(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Email Advisory Digests</div>
                    <div className="text-[10px] text-slate-400">Sent immediately upon severe threshold breach</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Mobile & Browser Push</div>
                    <div className="text-[10px] text-slate-400">Real-time device notifications</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                {saveSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving Configuration...' : 'Save Surveillance Rules'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
