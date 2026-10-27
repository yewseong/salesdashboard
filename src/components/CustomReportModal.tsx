import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Filter, 
  CheckSquare, 
  Square, 
  Table, 
  Layers,
  Calendar,
  Share2,
  FileCheck
} from 'lucide-react';
import { SalesRep, MonthlyRevenueRecord, Deal, ForecastMonth } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface CustomReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reps: SalesRep[];
  monthlyData: MonthlyRevenueRecord[];
  deals: Deal[];
  forecastData: ForecastMonth[];
}

export const CustomReportModal: React.FC<CustomReportModalProps> = ({
  isOpen,
  onClose,
  reps,
  monthlyData,
  deals,
  forecastData,
}) => {
  // Report Config State
  const [reportType, setReportType] = useState<'rep_performance' | 'monthly_revenue' | 'forecast_12m' | 'deals_pipeline'>('rep_performance');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [includeForecast, setIncludeForecast] = useState<boolean>(true);
  const [selectedMetrics, setSelectedMetrics] = useState<{ [key: string]: boolean }>({
    revenue: true,
    quota: true,
    attainment: true,
    winRate: true,
    pipeline: true,
    avgDeal: true,
    activities: true,
  });

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered reps for report
  const filteredReps = useMemo(() => {
    return reps.filter(r => {
      if (teamFilter !== 'All' && r.team !== teamFilter) return false;
      if (regionFilter !== 'All' && r.region !== regionFilter) return false;
      return true;
    });
  }, [reps, teamFilter, regionFilter]);

  // Export to CSV function
  const handleExportCSV = () => {
    let csvRows: string[] = [];

    if (reportType === 'rep_performance') {
      const headers = ['Representative', 'Team', 'Region', 'Quota', 'Revenue Closed', 'Attainment %', 'Win Rate %', 'Pipeline Value', 'Avg Deal Size', 'Calls', 'Demos', 'Proposals'];
      csvRows.push(headers.join(','));

      filteredReps.forEach(r => {
        const row = [
          `"${r.name}"`,
          `"${r.team}"`,
          `"${r.region}"`,
          r.quota,
          r.revenueClosed,
          `${((r.revenueClosed / r.quota) * 100).toFixed(1)}%`,
          `${r.winRate.toFixed(1)}%`,
          r.totalPipelineValue,
          r.avgDealSize,
          r.activities.callsCount,
          r.activities.demosHeld,
          r.activities.proposalsSent,
        ];
        csvRows.push(row.join(','));
      });
    } else if (reportType === 'monthly_revenue') {
      const headers = ['Month', 'Actual Revenue', 'Target Quota', 'Attainment %', 'New Business', 'Expansion', 'Churn', 'Deals Won'];
      csvRows.push(headers.join(','));

      monthlyData.forEach(m => {
        const row = [
          `"${m.month}"`,
          m.actualRevenue,
          m.targetRevenue,
          `${((m.actualRevenue / m.targetRevenue) * 100).toFixed(1)}%`,
          m.newBusinessRevenue,
          m.expansionRevenue,
          m.churnAmount,
          m.dealsClosed,
        ];
        csvRows.push(row.join(','));
      });
    } else if (reportType === 'forecast_12m') {
      const headers = ['Forecast Month', 'Expected Revenue', 'Target Quota', 'Variance', 'Conservative (P10)', 'Optimistic (P90)', 'Confidence Score'];
      csvRows.push(headers.join(','));

      forecastData.forEach(f => {
        const row = [
          `"${f.month}"`,
          f.expectedRevenue,
          f.targetRevenue,
          f.expectedRevenue - f.targetRevenue,
          f.conservativeRevenue,
          f.optimisticRevenue,
          `${f.confidenceScore}%`,
        ];
        csvRows.push(row.join(','));
      });
    } else {
      const headers = ['Deal ID', 'Title', 'Client', 'Representative', 'Amount', 'Stage', 'Probability %', 'Close Date', 'Product', 'Segment'];
      csvRows.push(headers.join(','));

      deals.forEach(d => {
        const row = [
          `"${d.id}"`,
          `"${d.title.replace(/"/g, '""')}"`,
          `"${d.client.replace(/"/g, '""')}"`,
          `"${d.repName}"`,
          d.amount,
          `"${d.stage}"`,
          `${d.probability}%`,
          `"${d.expectedCloseDate}"`,
          `"${d.product}"`,
          `"${d.segment}"`,
        ];
        csvRows.push(row.join(','));
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `sales_report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    let exportObj: any = {
      generatedAt: new Date().toISOString(),
      reportType,
      filters: { teamFilter, regionFilter },
    };

    if (reportType === 'rep_performance') exportObj.data = filteredReps;
    else if (reportType === 'monthly_revenue') exportObj.data = monthlyData;
    else if (reportType === 'forecast_12m') exportObj.data = forecastData;
    else exportObj.data = deals;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `sales_report_${reportType}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Custom Sales Report Builder & Data Exporter
              </h3>
              <p className="text-xs text-slate-400">
                Configure tailored executive reports, filter criteria, and download structured CSV/JSON datasets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* 1. Report Dataset Selection */}
          <div>
            <label className="text-slate-300 font-bold block mb-2 uppercase tracking-wider text-[11px]">
              1. Select Report Type & Aggregation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setReportType('rep_performance')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  reportType === 'rep_performance'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white mb-0.5">Team & Rep KPIs</div>
                <div className="text-[10px] text-slate-400">Quota attainment, win rates, calls & demo activities</div>
              </button>

              <button
                onClick={() => setReportType('monthly_revenue')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  reportType === 'monthly_revenue'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white mb-0.5">Monthly Revenue 12M</div>
                <div className="text-[10px] text-slate-400">Historical actuals vs target, expansion & churn</div>
              </button>

              <button
                onClick={() => setReportType('forecast_12m')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  reportType === 'forecast_12m'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white mb-0.5">12-Month Forecast</div>
                <div className="text-[10px] text-slate-400">Oct 26 - Sep 27 projections, variance, bounds</div>
              </button>

              <button
                onClick={() => setReportType('deals_pipeline')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  reportType === 'deals_pipeline'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white mb-0.5">Pipeline Opportunities</div>
                <div className="text-[10px] text-slate-400">Stage probability, weighted values, close dates</div>
              </button>
            </div>
          </div>

          {/* 2. Filter Bar */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <label className="text-slate-300 font-bold block mb-2.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Segment & Regional Filters</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Sales Division:</label>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Divisions</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="SMB">SMB & Commercial</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Geographic Region:</label>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="APAC">APAC</option>
                  <option value="LATAM">LATAM</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Time Horizon:</label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 font-medium">
                  {reportType === 'forecast_12m' ? 'Oct 2026 – Sep 2027 (12M)' : 'Trailing 12M + Current MTD'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Live Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-indigo-400" />
                <span>Report Output Preview</span>
              </label>
              <span className="text-slate-500 text-[11px]">
                {reportType === 'rep_performance' ? `${filteredReps.length} reps match filters` : `${monthlyData.length} records`}
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-800">
                  {reportType === 'rep_performance' ? (
                    <tr>
                      <th className="py-2 px-3">Rep Name</th>
                      <th className="py-2 px-3">Division</th>
                      <th className="py-2 px-3">Quota</th>
                      <th className="py-2 px-3">Closed</th>
                      <th className="py-2 px-3">Attainment</th>
                      <th className="py-2 px-3">Win Rate</th>
                      <th className="py-2 px-3 text-right">Activities</th>
                    </tr>
                  ) : reportType === 'monthly_revenue' ? (
                    <tr>
                      <th className="py-2 px-3">Month</th>
                      <th className="py-2 px-3">Actual Revenue</th>
                      <th className="py-2 px-3">Target Quota</th>
                      <th className="py-2 px-3">Attainment</th>
                      <th className="py-2 px-3">New Business</th>
                      <th className="py-2 px-3 text-right">Deals Won</th>
                    </tr>
                  ) : reportType === 'forecast_12m' ? (
                    <tr>
                      <th className="py-2 px-3">Forecast Period</th>
                      <th className="py-2 px-3">Expected Revenue</th>
                      <th className="py-2 px-3">Target Quota</th>
                      <th className="py-2 px-3">Variance</th>
                      <th className="py-2 px-3 text-right">Confidence</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="py-2 px-3">Deal</th>
                      <th className="py-2 px-3">Client</th>
                      <th className="py-2 px-3">Owner</th>
                      <th className="py-2 px-3">Value</th>
                      <th className="py-2 px-3 text-right">Probability</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {reportType === 'rep_performance' ? (
                    filteredReps.map(r => (
                      <tr key={r.id} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-medium text-white">{r.name}</td>
                        <td className="py-2 px-3 text-slate-400">{r.team}</td>
                        <td className="py-2 px-3 text-slate-300">{formatCurrency(r.quota)}</td>
                        <td className="py-2 px-3 font-bold text-emerald-400">{formatCurrency(r.revenueClosed)}</td>
                        <td className="py-2 px-3 text-indigo-400 font-semibold">{((r.revenueClosed / r.quota) * 100).toFixed(1)}%</td>
                        <td className="py-2 px-3 text-slate-300">{r.winRate.toFixed(1)}%</td>
                        <td className="py-2 px-3 text-right text-slate-400">{r.activities.callsCount} calls • {r.activities.demosHeld} demos</td>
                      </tr>
                    ))
                  ) : reportType === 'monthly_revenue' ? (
                    monthlyData.map(m => (
                      <tr key={m.month} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-medium text-white">{m.month}</td>
                        <td className="py-2 px-3 font-bold text-indigo-400">{formatCurrency(m.actualRevenue)}</td>
                        <td className="py-2 px-3 text-slate-300">{formatCurrency(m.targetRevenue)}</td>
                        <td className="py-2 px-3 text-emerald-400 font-semibold">{((m.actualRevenue / m.targetRevenue) * 100).toFixed(1)}%</td>
                        <td className="py-2 px-3 text-slate-400">{formatCurrency(m.newBusinessRevenue)}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{m.dealsClosed}</td>
                      </tr>
                    ))
                  ) : reportType === 'forecast_12m' ? (
                    forecastData.map(f => (
                      <tr key={f.month} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-medium text-white">{f.month}</td>
                        <td className="py-2 px-3 font-bold text-cyan-400">{formatCurrency(f.expectedRevenue)}</td>
                        <td className="py-2 px-3 text-slate-300">{formatCurrency(f.targetRevenue)}</td>
                        <td className="py-2 px-3 font-semibold text-emerald-400">{f.expectedRevenue >= f.targetRevenue ? '+' : ''}{formatCurrency(f.expectedRevenue - f.targetRevenue)}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{f.confidenceScore}%</td>
                      </tr>
                    ))
                  ) : (
                    deals.map(d => (
                      <tr key={d.id} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 font-medium text-white">{d.title}</td>
                        <td className="py-2 px-3 text-slate-300">{d.client}</td>
                        <td className="py-2 px-3 text-slate-400">{d.repName}</td>
                        <td className="py-2 px-3 font-bold text-indigo-400">{formatCurrency(d.amount)}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{d.probability}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for export (UTF-8 formatted)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Executive Summary</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
