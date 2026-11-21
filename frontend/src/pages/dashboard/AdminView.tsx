import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Database,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingUser, setIsUpdatingUser] = useState<number | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [dashStats, users] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers(),
      ]);
      setStats(dashStats);
      setUsersList(users);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setIsUpdatingUser(targetUser.id);
    try {
      await api.updateUserRole(targetUser.id, newRole);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingUser(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Root Administrative Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Administration & Telemetry Health
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cluster monitoring, sensor assimilation status, and role-based access control
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Cluster State</span>
        </button>
      </div>

      {/* SYSTEM STATS METRIC TILES */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {stats.total_users}
            </div>
            <div className="text-[10px] text-emerald-500 mt-0.5">● {stats.active_users} Active</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Monitors</span>
            <div className="text-2xl font-black font-mono text-blue-600 dark:text-cyan-400 mt-1">
              {stats.total_stations}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Reference BAM units</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Telemetry</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {stats.total_measurements.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Ingested records</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Alerts</span>
            <div className="text-2xl font-black font-mono text-amber-500 mt-1">
              {stats.active_alerts}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Threshold triggers</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Audits Generated</span>
            <div className="text-2xl font-black font-mono text-purple-500 mt-1">
              {stats.generated_reports}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">PDF / CSV exports</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">API Cluster</span>
            <div className="text-2xl font-black font-mono text-emerald-500 mt-1">
              99.98%
            </div>
            <div className="text-[10px] text-emerald-500 mt-0.5">Zero downtime</div>
          </div>
        </div>
      )}

      {/* DATA INGESTION SOURCES STATUS */}
      {stats?.data_sources && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Atmospheric Ingestion Pipelines & Data Feeds
              </h3>
              <p className="text-xs text-slate-500">Continuous telemetry pipeline health</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Upstream Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.data_sources.map((src: any) => (
              <div
                key={src.name}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{src.name}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {src.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{src.type}</p>
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Latency: <strong className="text-slate-700 dark:text-slate-300">{src.latency_ms}ms</strong></span>
                  <span>Uptime: <strong className="text-slate-700 dark:text-slate-300">{src.uptime}</strong></span>
                  <span>Sync: <strong className="text-slate-700 dark:text-slate-300">{src.last_sync}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Registered Platform Users ({usersList.length})
            </h3>
            <p className="text-xs text-slate-500">Manage identity, permissions, and administrative roles</p>
          </div>
          <Users className="w-5 h-5 text-blue-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-6 font-bold">User Identity</th>
                <th className="py-3 px-6 font-bold">Email</th>
                <th className="py-3 px-6 font-bold">Default City</th>
                <th className="py-3 px-6 font-bold">Current Role</th>
                <th className="py-3 px-6 font-bold">Created</th>
                <th className="py-3 px-6 font-bold text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    {u.full_name}
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">
                    {u.email}
                  </td>
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                    {u.city}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={isUpdatingUser === u.id}
                      className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      {isUpdatingUser === u.id
                        ? 'Updating...'
                        : u.role === 'admin'
                        ? 'Demote to Citizen'
                        : 'Promote to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT LOGS STREAM */}
      {stats?.recent_audits && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cluster Security & Telemetry Audit Trail
              </h3>
              <p className="text-xs text-slate-500">Immutable ledger of platform actions and ingestion cycles</p>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
            {stats.recent_audits.map((a: any) => (
              <div
                key={a.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-slate-600 dark:text-slate-300"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600 dark:text-cyan-400">{a.action}</span>
                  <span className="text-slate-400">[{a.resource}]</span>
                  <span className="text-slate-800 dark:text-slate-200">{a.details}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(a.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
