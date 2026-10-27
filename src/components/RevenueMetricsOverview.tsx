import React from 'react';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Award, 
  Layers, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MonthlyRevenueRecord, SalesRep, Deal } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface RevenueMetricsOverviewProps {
  currentMonth: MonthlyRevenueRecord;
  reps: SalesRep[];
  deals: Deal[];
  selectedTeam: string;
}

export const RevenueMetricsOverview: React.FC<RevenueMetricsOverviewProps> = ({
  currentMonth,
  reps,
  deals,
  selectedTeam,
}) => {
  // Filter reps if team selected
  const filteredReps = selectedTeam === 'All' 
    ? reps 
    : reps.filter(r => r.team === selectedTeam);

  const filteredDeals = selectedTeam === 'All'
    ? deals
    : deals.filter(d => d.segment === selectedTeam);

  const teamQuota = filteredReps.reduce((acc, r) => acc + r.quota, 0);
  const teamClosed = filteredReps.reduce((acc, r) => acc + r.revenueClosed, 0);
  const teamPipeline = filteredReps.reduce((acc, r) => acc + r.totalPipelineValue, 0);
  const totalWon = filteredReps.reduce((acc, r) => acc + r.dealsWonCount, 0);
  const totalLost = filteredReps.reduce((acc, r) => acc + r.dealsLostCount, 0);
  
  const winRate = (totalWon + totalLost) > 0 
    ? (totalWon / (totalWon + totalLost)) * 100 
    : 0;

  const quotaAttainment = teamQuota > 0 ? (teamClosed / teamQuota) * 100 : 0;
  const pipelineCoverage = teamQuota > 0 ? (teamPipeline / teamQuota) : 0;
  const avgDealSize = totalWon > 0 ? teamClosed / totalWon : 0;

  // 22 out of 30 days in September = 73.3% month elapsed
  const monthElapsedPct = 73.3;
  const isPacingAhead = quotaAttainment >= monthElapsedPct;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Monthly Revenue & Quota */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            September Revenue (MTD)
          </span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-extrabold text-white font-display tracking-tight">
            {formatCurrency(teamClosed)}
          </div>
          <span className="text-xs font-semibold text-emerald-400 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +8.4% MoM
          </span>
        </div>

        {/* Progress against Monthly Quota */}
        <div className="mt-2.5">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">
              Target: <span className="text-slate-300 font-medium">{formatCurrency(teamQuota)}</span>
            </span>
            <span className={`font-semibold ${quotaAttainment >= 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
              {quotaAttainment.toFixed(1)}% Attained
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
            <div 
              className={`h-2 rounded-full transition-all duration-700 ${
                quotaAttainment >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
              }`}
              style={{ width: `${Math.min(100, quotaAttainment)}%` }}
            />
            {/* Pacing marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
              style={{ left: `${monthElapsedPct}%` }}
              title={`Month pacing target: ${monthElapsedPct.toFixed(0)}%`}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
            <span className={isPacingAhead ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {isPacingAhead ? '⚡ Pacing ahead of calendar' : '⚠️ Slight gap vs calendar pacing'}
            </span>
            <span>73% of Month Passed</span>
          </div>
        </div>
      </div>

      {/* 2. Pipeline Value & Coverage */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Pipeline Value
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-extrabold text-white font-display tracking-tight">
            {formatCurrency(teamPipeline, true)}
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {pipelineCoverage.toFixed(1)}x Coverage
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-2 flex items-center justify-between">
          <span>Weighted Pipeline:</span>
          <span className="text-slate-200 font-medium">
            {formatCurrency(teamPipeline * 0.58, true)}
          </span>
        </p>
        
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Coverage Health:
          </span>
          <span className="font-semibold text-emerald-400">Strong (3.0x+ Target)</span>
        </div>
      </div>

      {/* 3. Team Win Rate & Sales Velocity */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Team Win Rate & Velocity
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-extrabold text-white font-display tracking-tight">
            {winRate.toFixed(1)}%
          </div>
          <span className="text-xs font-semibold text-emerald-400 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +3.5% vs Q2
          </span>
        </div>

        <div className="mt-2.5 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Deals Closed / Lost:</span>
            <span className="text-slate-200 font-medium">
              <span className="text-emerald-400 font-bold">{totalWon} Won</span> / {totalLost} Lost
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Avg Cycle Duration:
            </span>
            <span className="text-slate-200 font-medium">31.4 Days</span>
          </div>
        </div>
      </div>

      {/* 4. Average Deal Size & ARR Run Rate */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Avg Deal Size & ARR
          </span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-extrabold text-white font-display tracking-tight">
            {formatCurrency(avgDealSize)}
          </div>
          <span className="text-xs font-semibold text-indigo-400">
            {totalWon} Deals
          </span>
        </div>

        <div className="mt-2.5 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Projected Annual Run Rate:</span>
            <span className="text-emerald-400 font-semibold">
              {formatCurrency(teamClosed * 12, true)} ARR
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Net Revenue Retention:</span>
            <span className="text-slate-200 font-medium">118.2% NRR</span>
          </div>
        </div>
      </div>

    </div>
  );
};
