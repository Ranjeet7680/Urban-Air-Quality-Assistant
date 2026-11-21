import React from 'react';
import { Logo } from './Logo';
import { Globe, Code2, Share2, ShieldCheck, Database, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              An intelligent environmental monitoring SaaS platform empowering citizens, municipal architects, and organizations to understand air pollution, identify hotspots, and receive AI-guided health precautions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="Community"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="Global Network"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Real-Time AQI</a></li>
              <li><a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">AirSense AI Assistant</a></li>
              <li><a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Pollution Map</a></li>
              <li><a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Copernicus Forecast</a></li>
              <li><a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Health Engine</a></li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              Data Sources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Open-Meteo Air API</span></li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Copernicus CAMS Model</span></li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">WHO 2021 Guidelines</span></li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">US EPA Standards</span></li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Google Gemini Multimodal</span></li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Integrity
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#contact" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Contact Scientists</a></li>
              <li><a href="#privacy" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#audit" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Sensor Calibration</a></li>
              <li><a href="#api-status" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">System Status: Operational</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Urban Air Quality Assistant. Environmental Intelligence SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Global Telemetry Ingestion Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
