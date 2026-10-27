import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { MonthlyRevenueRecord, ForecastControls, ForecastMonth } from '../types';
import { generate12MonthForecast } from '../data/mockSalesData';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface Forecast12MonthsProps {
  historicalData: MonthlyRevenueRecord[];
}

export const Forecast12Months: React.FC<Forecast12MonthsProps> = ({
  historicalData,
}) => {
  const [controls, setControls] = useState<ForecastControls>({
    scenario: 'baseline',
    growthRatePct: 2.8,
    churnRatePct: 1.8,
    winRateAdjustmentPct: 5.0,
    pipelineVelocityDays: 32,
  });

  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  // Compute forecast dynamically
  const forecastData: ForecastMonth[] = useMemo(() => {
    return generate12MonthForecast(historicalData, controls);
  }, [historicalData, controls]);

  // Aggregate 12M figures
  const totalForecastExpected = useMemo(() => {
    return forecastData.reduce((acc, m) => acc + m.expectedRevenue, 0);
  }, [forecastData]);

  const totalForecastTarget = useMemo(() => {
    return forecastData.reduce((acc, m) => acc + m.targetRevenue, 0);
  }, [forecastData]);

  const totalConservative = useMemo(() => {
    return forecastData.reduce((acc, m) => acc + m.conservativeRevenue, 0);
  }, [forecastData]);

  const totalOptimistic = useMemo(() => {
    return forecastData.reduce((acc, m) => acc + m.optimisticRevenue, 0);
  }, [forecastData]);

  const quotaVariance = totalForecastExpected - totalForecastTarget;
  const exitARR = (forecastData[forecastData.length - 1]?.expectedRevenue || 0) * 12;

  const resetControls = () => {
    setControls({
      scenario: 'baseline',
      growthRatePct: 2.8,
      churnRatePct: 1.8,
      winRateAdjustmentPct: 5.0,
      pipelineVelocityDays: 32,
    });
  };

  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ForecastMonth;
      const attainment = (dataPoint.expectedRevenue / dataPoint.targetRevenue) * 100;

      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-xl shadow-xl text-xs backdrop-blur-md min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white text-sm">{dataPoint.month}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              dataPoint.confidenceScore >= 80 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {dataPoint.confidenceScore}% Confidence
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Expected Forecast:</span>
              <span className="font-bold text-cyan-400 text-sm">{formatCurrency(dataPoint.expectedRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Target Quota:</span>
              <span className="font-semibold text-slate-300">{formatCurrency(dataPoint.targetRevenue)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Projected Attainment:</span>
              <span className={`font-bold ${attainment >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {attainment.toFixed(1)}%
              </span>
            </div>
            
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Optimistic (P90):</span>
                <span className="text-emerald-300">{formatCurrency(dataPoint.optimisticRevenue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Conservative (P10):</span>
                <span className="text-slate-400">{formatCurrency(dataPoint.conservativeRevenue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Weighted Pipeline Needed:</span>
                <span className="text-indigo-300">{formatCurrency(dataPoint.weightedPipeline)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-6">
      
      {/* Forecast Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Next 12 Months Predictive Revenue Forecast
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Machine-calibrated pipeline model spanning October 2026 to September 2027 with scenario stress testing.
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Scenario Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setControls(c => ({ ...c, scenario: 'conservative' }))}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                controls.scenario === 'conservative'
                  ? 'bg-amber-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Conservative
            </button>
            <button
              onClick={() => setControls(c => ({ ...c, scenario: 'baseline' }))}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                controls.scenario === 'baseline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => setControls(c => ({ ...c, scenario: 'optimistic' }))}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                controls.scenario === 'optimistic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Optimistic
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={resetControls}
            title="Reset forecast controls to defaults"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'chart' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Table
            </button>
          </div>
        </div>
      </div>

      {/* Projection Metric Highlights Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/90 mb-5">
        <div>
          <span className="text-slate-400 text-xs block mb-1">12-Month Projected Revenue</span>
          <div className="text-xl font-extrabold text-white font-display">
            {formatCurrency(totalForecastExpected, true)}
          </div>
          <span className="text-[11px] text-slate-500">
            Range: {formatCurrency(totalConservative, true)} – {formatCurrency(totalOptimistic, true)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-xs block mb-1">Quota Gap / Surplus</span>
          <div className={`text-xl font-extrabold font-display flex items-center ${
            quotaVariance >= 0 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {quotaVariance >= 0 ? '+' : ''}{formatCurrency(quotaVariance, true)}
          </div>
          <span className="text-[11px] text-slate-400">
            Target Quota: {formatCurrency(totalForecastTarget, true)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-xs block mb-1">Projected Exit ARR (Sep 2027)</span>
          <div className="text-xl font-extrabold text-cyan-400 font-display">
            {formatCurrency(exitARR, true)}
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +23.8% ARR Growth
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-xs block mb-1">Average Model Confidence</span>
          <div className="text-xl font-extrabold text-indigo-400 font-display">
            78.4%
          </div>
          <span className="text-[11px] text-slate-500">
            Based on active pipeline & velocity
          </span>
        </div>
      </div>

      {/* Interactive Levers / Tuning Drawer */}
      <div className="bg-slate-950/40 border border-slate-800/70 rounded-lg p-3.5 mb-5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-3">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Scenario Levers:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Growth Rate slider */}
          <div>
            <div className="flex justify-between mb-1 text-slate-400">
              <span>Monthly Growth Increment:</span>
              <span className="text-indigo-400 font-semibold">+{controls.growthRatePct}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={controls.growthRatePct}
              onChange={(e) => setControls(c => ({ ...c, growthRatePct: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Churn rate slider */}
          <div>
            <div className="flex justify-between mb-1 text-slate-400">
              <span>Monthly Gross Churn Rate:</span>
              <span className="text-amber-400 font-semibold">{controls.churnRatePct}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={controls.churnRatePct}
              onChange={(e) => setControls(c => ({ ...c, churnRatePct: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Win Rate uplift */}
          <div>
            <div className="flex justify-between mb-1 text-slate-400">
              <span>Win-Rate Uplift Effect:</span>
              <span className="text-emerald-400 font-semibold">+{controls.winRateAdjustmentPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={controls.winRateAdjustmentPct}
              onChange={(e) => setControls(c => ({ ...c, winRateAdjustmentPct: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Chart View or Table View */}
      {activeTab === 'chart' ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="monthShort" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
              />
              <Tooltip content={<CustomForecastTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              {/* Range band */}
              <Area 
                type="monotone" 
                dataKey="optimisticRevenue" 
                name="Optimistic Ceiling" 
                stroke="#10b981" 
                strokeDasharray="3 3"
                strokeWidth={1}
                fill="transparent"
              />
              <Area 
                type="monotone" 
                dataKey="conservativeRevenue" 
                name="Conservative Floor" 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                strokeWidth={1}
                fill="transparent"
              />

              {/* Expected projection */}
              <Area 
                type="monotone" 
                dataKey="expectedRevenue" 
                name="Expected Revenue" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fill="url(#forecastArea)" 
                dot={{ r: 4, fill: '#06b6d4' }}
              />

              {/* Target Quota line */}
              <Line 
                type="monotone" 
                dataKey="targetRevenue" 
                name="Target Quota" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Monthly Table View */
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Forecast Period</th>
                <th className="py-2.5 px-3">Expected Projection</th>
                <th className="py-2.5 px-3">Target Quota</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Conservative (P10)</th>
                <th className="py-2.5 px-3">Optimistic (P90)</th>
                <th className="py-2.5 px-3">Model Confidence</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
              {forecastData.map((row) => {
                const diff = row.expectedRevenue - row.targetRevenue;
                const isSurplus = diff >= 0;
                return (
                  <tr key={row.month} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {row.month}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-cyan-400">
                      {formatCurrency(row.expectedRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {formatCurrency(row.targetRevenue)}
                    </td>
                    <td className={`py-2.5 px-3 font-semibold ${isSurplus ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isSurplus ? '+' : ''}{formatCurrency(diff)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {formatCurrency(row.conservativeRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {formatCurrency(row.optimisticRevenue)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-400 h-1.5 rounded-full"
                            style={{ width: `${row.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-400">{row.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        isSurplus 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isSurplus ? 'Quota Exceeded' : 'Coverage Needed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
