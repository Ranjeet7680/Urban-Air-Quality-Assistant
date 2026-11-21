import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  Brain,
  CalendarDays,
  HeartPulse,
  BarChart3,
  Bell,
  FileText,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronDown,
  Search,
  Radio,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  Cpu
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { AQIBadge } from '../components/AQIBadge';
import { useAuth } from '../context/AuthContext';
import { useAirQuality } from '../context/AirQualityContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const {
    selectedCity,
    setSelectedCity,
    selectedStandard,
    setSelectedStandard,
    airQuality,
    unreadAlertsCount,
    alerts,
    markAlertRead,
    markAllAlertsRead
  } = useAirQuality();

  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [alertsPopoverOpen, setAlertsPopoverOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'world-map', label: 'AQI World Map', icon: Globe, isNew: true },
    { id: 'live-aqi', label: 'Live Air Quality', icon: Activity },
    { id: 'pollution-map', label: 'Pollution Map', icon: MapPin },
    { id: 'airsense-ai', label: 'AirSense AI', icon: Brain, isAi: true },
    { id: 'advanced-tech', label: 'Deep-Tech & Sentinel', icon: Cpu, isNew: true },
    { id: 'forecast', label: 'Forecast', icon: CalendarDays },
    { id: 'health', label: 'Health Guidance', icon: HeartPulse },
    { id: 'analytics', label: 'Historical Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Pollution Alerts', icon: Bell, badge: unreadAlertsCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldCheck });
  }

  const citiesList = [
    'New York',
    'London',
    'Delhi',
    'Tokyo',
    'Paris',
    'Los Angeles',
    'Berlin',
    'Sydney',
    'Mumbai',
    'Beijing'
  ];

  const filteredCities = citiesList.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 flex transition-colors font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-4 shrink-0 fixed top-0 bottom-0 z-30 transition-colors">
        <div>
          {/* Brand header */}
          <div className="px-2 py-3 mb-4">
            <Logo size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAi ? 'text-cyan-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.isAi && !isActive && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      Gemini
                    </span>
                  )}
                  {item.isNew && !isActive && !item.isAi && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Global
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Tools */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-400">Theme</span>
            <ThemeToggle />
          </div>

          {/* User profile capsule */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.full_name || 'Sarah Chen'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {user?.role === 'admin' ? 'Environmental Admin' : `${user?.city || 'New York'}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR MODAL */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <Logo size="md" />
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <ThemeToggle />
              <button onClick={handleLogout} className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-20 h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4 transition-colors">
          
          {/* Left: Mobile hamburger & Active view title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
              <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
                UrbanAir
              </button>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold capitalize">
                {currentTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Center & Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Live Stream Status indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry: <strong>Live CAMS</strong></span>
            </div>

            {/* City Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {citiesList.map((c) => (
                  <option key={c} value={c}>
                    📍 {c}
                  </option>
                ))}
              </select>
            </div>

            {/* AQI Standard Selector */}
            <div className="hidden sm:block">
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <option value="US_EPA">Standard: US EPA</option>
                <option value="WHO">Standard: WHO 2021</option>
                <option value="EAQI">Standard: European EAQI</option>
                <option value="NAQI">Standard: Indian NAQI</option>
              </select>
            </div>

            {/* Alerts Bell Popover */}
            <div className="relative">
              <button
                onClick={() => setAlertsPopoverOpen(!alertsPopoverOpen)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {alertsPopoverOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Pollution Alerts ({unreadAlertsCount} Unread)
                    </span>
                    {unreadAlertsCount > 0 && (
                      <button
                        onClick={markAllAlertsRead}
                        className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {alerts.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No active alerts</p>
                    ) : (
                      alerts.slice(0, 5).map((alert) => (
                        <div
                          key={alert.id}
                          onClick={() => markAlertRead(alert.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                            alert.is_read
                              ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                              : 'bg-blue-50/70 dark:bg-blue-950/40 text-slate-800 dark:text-slate-200 border-l-2 border-blue-500'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{alert.title}</span>
                            {alert.aqi_value && (
                              <span className="font-mono text-[10px] px-1 rounded bg-slate-200 dark:bg-slate-700">
                                AQI {alert.aqi_value}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5 line-clamp-2">{alert.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        onTabChange('alerts');
                        setAlertsPopoverOpen(false);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      View all alerts & configure rules →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div
                onClick={() => onTabChange('settings')}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm hover:ring-2 hover:ring-blue-500"
                title="Account Settings"
              >
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            </div>

          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto outline-none">
          {children}
        </main>
      </div>

    </div>
  );
};
