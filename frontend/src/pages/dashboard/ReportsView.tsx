import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Eye,
  X,
  FileBarChart,
  Printer,
  Radio
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { api } from '../../services/api';
import { GeneratedReport } from '../../types';

export const ReportsView: React.FC = () => {
  const { selectedCity } = useAirQuality();
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [targetCity, setTargetCity] = useState(selectedCity);
  const [comparisonCity, setComparisonCity] = useState('London');
  const [includeAi, setIncludeAi] = useState(true);

  // Preview modal states
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const list = await api.getReports();
      setReports(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const newReport = await api.generateReport({
        report_type: reportType,
        city: targetCity,
        comparison_city: reportType === 'location_comparison' ? comparisonCity : undefined,
        include_ai_summary: includeAi,
      });
      setModalOpen(false);
      setPreviewReport(newReport);
      await fetchReports();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReportCSV = (report: GeneratedReport) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        `Report Title,${report.title}\n` +
        `Report Type,${report.report_type}\n` +
        `Location,${report.location_name}\n` +
        `Average AQI,${report.avg_aqi}\n` +
        `Peak AQI,${report.max_aqi}\n` +
        `Dominant Pollutant,${report.dominant_pollutant}\n` +
        `Data Source,${report.data_source}\n` +
        `Created At,${report.created_at}\n\n` +
        `Executive Summary,"${report.summary}"\n\n` +
        `AI Environmental Analysis,"${report.ai_analysis || 'N/A'}"\n`
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Report_${report.location_name}_${report.report_type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Generate CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Environmental Intelligence Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate, preview, and export compliance audits and atmospheric summaries
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* REPORTS LIST TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Archived Reports ({reports.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            PDF & CSV Direct Download Active
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading reports directory...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileBarChart className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-500">No reports generated yet.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Generate your first daily summary now →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-6 font-bold">Report Title</th>
                  <th className="py-3 px-6 font-bold">Type</th>
                  <th className="py-3 px-6 font-bold">Location</th>
                  <th className="py-3 px-6 font-bold">Avg AQI</th>
                  <th className="py-3 px-6 font-bold">Peak AQI</th>
                  <th className="py-3 px-6 font-bold">Dominant</th>
                  <th className="py-3 px-6 font-bold">Generated</th>
                  <th className="py-3 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {r.title}
                    </td>
                    <td className="py-4 px-6 capitalize">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {r.report_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                      {r.location_name}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold">{r.avg_aqi}</td>
                    <td className="py-4 px-6 font-mono font-bold text-rose-500">{r.max_aqi}</td>
                    <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{r.dominant_pollutant}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setPreviewReport(r)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                        title="Preview Report"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        Preview
                      </button>
                      <button
                        onClick={() => downloadReportCSV(r)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 font-semibold cursor-pointer"
                        title="Download CSV"
                      >
                        <Download className="w-3.5 h-3.5 inline mr-1" />
                        CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* GENERATOR MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Generate Environmental Audit Report
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="daily">Daily Air Quality Summary (24h)</option>
                  <option value="weekly">Weekly Environmental Audit (7 Days)</option>
                  <option value="monthly">Monthly Pollution Analysis (30 Days)</option>
                  <option value="location_comparison">Location Comparison Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Location
                </label>
                <select
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  {['New York', 'London', 'Delhi', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Mumbai'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {reportType === 'location_comparison' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Benchmark Comparison City
                  </label>
                  <select
                    value={comparisonCity}
                    onChange={(e) => setComparisonCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    {['London', 'New York', 'Tokyo', 'Delhi', 'Paris'].filter(c => c !== targetCity).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAi}
                    onChange={(e) => setIncludeAi(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Include AirSense AI Environmental Synthesis & Dispersion Narrative</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Compiling Audit...' : 'Generate Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW REPORT MODAL */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-bold">
                  Official Environmental Audit
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {previewReport.title}
                </h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mean Period AQI</span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{previewReport.avg_aqi}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Peak Exposure</span>
                <div className="text-2xl font-black font-mono text-rose-500">{previewReport.max_aqi}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Primary Stressor</span>
                <div className="text-2xl font-black font-mono text-blue-600 dark:text-cyan-400">{previewReport.dominant_pollutant}</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Executive Telemetry Summary
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {previewReport.summary}
              </p>
            </div>

            {/* AI Environmental Assessment */}
            {previewReport.ai_analysis && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-500">
                  <Sparkles className="w-3.5 h-3.5" />
                  AirSense AI Atmospheric Synthesis
                </div>
                <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 whitespace-pre-line">
                  {previewReport.ai_analysis}
                </div>
              </div>
            )}

            {/* Report Metadata Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span>Source: <strong>{previewReport.data_source}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadReportCSV(previewReport)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
