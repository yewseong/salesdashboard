import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Deal } from '../types';
import { STAGE_META } from '../data/mockSalesData';
import { formatCurrency } from '../utils/formatters';
import { Filter, Layers, Zap } from 'lucide-react';

interface PipelineDistributionChartProps {
  deals: Deal[];
  selectedTeam: string;
}

export const PipelineDistributionChart: React.FC<PipelineDistributionChartProps> = ({
  deals,
  selectedTeam,
}) => {
  const filteredDeals = selectedTeam === 'All'
    ? deals
    : deals.filter(d => d.segment === selectedTeam);

  // Group deals by stage
  const stages: (keyof typeof STAGE_META)[] = [
    'discovery',
    'qualification',
    'demo',
    'proposal',
    'negotiation',
    'closed_won',
  ];

  const stageData = stages.map(stageKey => {
    const meta = STAGE_META[stageKey];
    const stageDeals = filteredDeals.filter(d => d.stage === stageKey);
    const totalAmount = stageDeals.reduce((acc, d) => acc + d.amount, 0);
    const weightedAmount = Math.round(totalAmount * (meta.probability / 100));

    return {
      stage: meta.label,
      key: stageKey,
      count: stageDeals.length,
      amount: totalAmount,
      weightedAmount,
      probability: meta.probability,
      color: meta.color,
    };
  });

  const totalPipeline = stageData
    .filter(s => s.key !== 'closed_won' && s.key !== 'closed_lost')
    .reduce((acc, s) => acc + s.amount, 0);

  const totalWeighted = stageData
    .filter(s => s.key !== 'closed_won' && s.key !== 'closed_lost')
    .reduce((acc, s) => acc + s.weightedAmount, 0);

  const CustomFunnelTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <div className="font-bold text-white text-sm mb-1.5 flex items-center justify-between gap-3">
            <span>{data.stage}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
              {data.probability}% Probability
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Total Stage Value:</span>
              <span className="font-bold text-white">{formatCurrency(data.amount)}</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Weighted Pipeline:</span>
              <span className="font-bold text-indigo-400">{formatCurrency(data.weightedAmount)}</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Active Deals:</span>
              <span className="font-semibold text-slate-200">{data.count} opportunities</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-display">
              Pipeline Stage Funnel & Velocity
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active opportunities progressing from qualification through commercial negotiation.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-500 mr-1.5">Unweighted:</span>
            <span className="text-white font-bold">{formatCurrency(totalPipeline, true)}</span>
          </div>
          <div className="w-px h-3 bg-slate-800" />
          <div>
            <span className="text-slate-500 mr-1.5">Weighted:</span>
            <span className="text-cyan-400 font-bold">{formatCurrency(totalWeighted, true)}</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar */}
      <div className="h-60 w-full mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stageData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis 
              dataKey="stage" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
            />
            <Tooltip content={<CustomFunnelTooltip />} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={45}>
              {stageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stage Cards summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {stageData.map((s) => (
          <div key={s.key} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-300 truncate" title={s.stage}>
                {s.stage}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {s.count}
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {formatCurrency(s.amount, true)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Weighted: <span style={{ color: s.color }}>{formatCurrency(s.weightedAmount, true)}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
