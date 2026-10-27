import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from 'recharts';
import { MonthlyRevenueRecord } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { BarChart3, Layers, TrendingUp, DollarSign } from 'lucide-react';

interface MonthlyRevenueChartProps {
  monthlyData: MonthlyRevenueRecord[];
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({
  monthlyData,
}) => {
  const [chartMode, setChartMode] = useState<'target' | 'composition' | 'deals'>('target');

  // Calculate summary metrics
  const totalTrailingRevenue = monthlyData.reduce((acc, m) => acc + m.actualRevenue, 0);
  const totalTargetRevenue = monthlyData.reduce((acc, m) => acc + m.targetRevenue, 0);
  const avgAttainment = (totalTrailingRevenue / totalTargetRevenue) * 100;
  const bestMonth = [...monthlyData].sort((a, b) => b.actualRevenue - a.actualRevenue)[0];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as MonthlyRevenueRecord;
      const attainment = (dataPoint.actualRevenue / dataPoint.targetRevenue) * 100;
      const variance = dataPoint.actualRevenue - dataPoint.targetRevenue;

      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-xl shadow-xl text-xs backdrop-blur-md min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white text-sm">{dataPoint.month}</span>
            {dataPoint.isCurrent && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                In Progress
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Actual Revenue:</span>
              <span className="font-bold text-indigo-400">{formatCurrency(dataPoint.actualRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Target Quota:</span>
              <span className="font-semibold text-slate-300">{formatCurrency(dataPoint.targetRevenue)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Attainment:</span>
              <span className={`font-bold ${attainment >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {attainment.toFixed(1)}% ({variance >= 0 ? '+' : ''}{formatCurrency(variance)})
              </span>
            </div>
            
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>New Business:</span>
                <span className="text-slate-200">{formatCurrency(dataPoint.newBusinessRevenue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expansion & Renewals:</span>
                <span className="text-slate-200">{formatCurrency(dataPoint.expansionRevenue)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Deals Closed:</span>
                <span className="text-slate-200">{dataPoint.dealsClosed} deals</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6">
      
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-display">
              Monthly Revenue Performance (Trailing 12 Months)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical actuals vs target quota, new business generation, and growth composition.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setChartMode('target')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              chartMode === 'target'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Actual vs Target
          </button>
          <button
            onClick={() => setChartMode('composition')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              chartMode === 'composition'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue Composition
          </button>
          <button
            onClick={() => setChartMode('deals')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              chartMode === 'deals'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deals Closed
          </button>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 mb-5 text-xs">
        <div>
          <span className="text-slate-500 block">Total 12M Revenue</span>
          <span className="text-slate-200 font-bold text-sm">
            {formatCurrency(totalTrailingRevenue, true)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Avg Monthly Attainment</span>
          <span className={`font-bold text-sm ${avgAttainment >= 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {avgAttainment.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Peak Revenue Month</span>
          <span className="text-slate-200 font-bold text-sm">
            {bestMonth.monthShort} ({formatCurrency(bestMonth.actualRevenue, true)})
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">YTD Net Growth</span>
          <span className="text-emerald-400 font-bold text-sm">
            +24.6% YoY
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'target' ? (
            <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
              />
              <Bar 
                dataKey="actualRevenue" 
                name="Actual Revenue" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={38} 
              />
              <Line 
                type="monotone" 
                dataKey="targetRevenue" 
                name="Target Quota" 
                stroke="#38bdf8" 
                strokeWidth={2.5} 
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#38bdf8' }} 
              />
            </ComposedChart>
          ) : chartMode === 'composition' ? (
            <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar 
                dataKey="newBusinessRevenue" 
                name="New Business ARR" 
                stackId="a" 
                fill="#4f46e5" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={38} 
              />
              <Bar 
                dataKey="expansionRevenue" 
                name="Expansion & Upsell" 
                stackId="a" 
                fill="#06b6d4" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={38} 
              />
              <Line 
                type="monotone" 
                dataKey="churnAmount" 
                name="Gross Churn" 
                stroke="#f43f5e" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#f43f5e' }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="monthShort" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <YAxis 
                yAxisId="left"
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val}`} 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar 
                yAxisId="left"
                dataKey="dealsClosed" 
                name="Deals Closed Count" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={38} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgDealSize" 
                name="Avg Deal Size ($)" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#f59e0b' }} 
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  );
};
