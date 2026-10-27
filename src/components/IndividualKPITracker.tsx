import React, { useState } from 'react';
import { 
  SalesRep, 
  Deal 
} from '../types';
import { 
  Award, 
  Target, 
  Phone, 
  Tv, 
  FileText, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Briefcase, 
  BarChart2, 
  Layers,
  ChevronDown,
  Edit3
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { STAGE_META } from '../data/mockSalesData';

interface IndividualKPITrackerProps {
  reps: SalesRep[];
  deals: Deal[];
  selectedRepId: string;
  onSelectRepId: (id: string) => void;
  onEditQuota: (rep: SalesRep) => void;
}

export const IndividualKPITracker: React.FC<IndividualKPITrackerProps> = ({
  reps,
  deals,
  selectedRepId,
  onSelectRepId,
  onEditQuota,
}) => {
  const rep = reps.find((r) => r.id === selectedRepId) || reps[0];

  // Deals associated with this rep
  const repDeals = deals.filter((d) => d.repId === rep.id);
  const openDeals = repDeals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const wonDeals = repDeals.filter((d) => d.stage === 'closed_won');

  const attainment = (rep.revenueClosed / rep.quota) * 100;
  const isExceeding = attainment >= 100;
  const isOnTrack = attainment >= 73; // 73% of month passed

  const callsProgress = (rep.activities.callsCount / rep.activities.callsTarget) * 100;
  const demosProgress = (rep.activities.demosHeld / rep.activities.demosTarget) * 100;
  const proposalsProgress = (rep.activities.proposalsSent / rep.activities.proposalsTarget) * 100;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6">
      
      {/* Header and Rep Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-display">
              Individual Representative KPI Performance Scorecard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep-dive operational metrics, quota pacing, conversion funnel, and activity KPIs.
          </p>
        </div>

        {/* Representative Dropdown Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Select Rep:</label>
          <div className="relative">
            <select
              aria-label="Select Representative"
              value={selectedRepId}
              onChange={(e) => onSelectRepId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-semibold rounded-lg text-white px-3.5 py-2 pr-8 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {reps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.team} - {r.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rep Profile & Quota Summary Banner */}
      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <img 
              src={rep.avatar} 
              alt={rep.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">{rep.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {rep.team} Division
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {rep.region}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{rep.role}</p>
              
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-slate-400">
                  Status: 
                  <span className={`ml-1 font-semibold ${isExceeding ? 'text-emerald-400' : isOnTrack ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {isExceeding ? '🎉 Quota Crushed' : isOnTrack ? '⚡ On Pace to Goal' : '⚠️ Action Plan Required'}
                  </span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  Rank: <span className="text-slate-200 font-semibold">#{reps.findIndex(r => r.id === rep.id) + 1} of {reps.length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Quota Pill */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between lg:justify-end gap-6 self-stretch lg:self-auto">
            <div>
              <span className="text-[11px] text-slate-400 block">Monthly Quota</span>
              <span className="text-base font-bold text-white">{formatCurrency(rep.quota)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Closed MTD</span>
              <span className="text-base font-bold text-emerald-400">{formatCurrency(rep.revenueClosed)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Attainment</span>
              <span className="text-base font-bold text-indigo-400">{attainment.toFixed(1)}%</span>
            </div>
            <button
              onClick={() => onEditQuota(rep)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Edit Rep Quota"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

        </div>
      </div>

      {/* 4 Primary KPI Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* KPI 1: Win Rate & Conversion */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider">Opportunity Win Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-display mb-1">
            {rep.winRate.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-400 mb-3">
            {rep.dealsWonCount} closed won • {rep.dealsLostCount} closed lost
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-400 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, rep.winRate)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Team benchmark: 65.0%
          </span>
        </div>

        {/* KPI 2: Average Deal Size */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider">Avg Deal Size</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-display mb-1">
            {formatCurrency(rep.avgDealSize)}
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Highest deal closed: {formatCurrency(Math.max(...(wonDeals.map(d => d.amount).concat([rep.avgDealSize * 1.6]))))}
          </p>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Segment target achieved
          </div>
        </div>

        {/* KPI 3: Sales Cycle Duration */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider">Sales Velocity Cycle</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-display mb-1">
            {rep.avgSalesCycleDays} <span className="text-sm font-normal text-slate-400">Days</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Discovery to contract execution
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {38 - rep.avgSalesCycleDays >= 0 ? `${38 - rep.avgSalesCycleDays}d faster than avg` : `${rep.avgSalesCycleDays - 38}d cycle`}
          </span>
        </div>

        {/* KPI 4: Pipeline Coverage */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider">Pipeline Coverage</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-display mb-1">
            {(rep.totalPipelineValue / rep.quota).toFixed(1)}x
          </div>
          <p className="text-xs text-slate-400 mb-3">
            {formatCurrency(rep.totalPipelineValue, true)} active pipeline
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, ((rep.totalPipelineValue / rep.quota) / 4) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Healthy threshold &gt; 3.0x
          </span>
        </div>

      </div>

      {/* Activity Execution KPIs & Historical Quarters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        
        {/* Activity Tracking KPIs */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Monthly Activity Targets & Execution</span>
          </h4>

          <div className="space-y-4 text-xs">
            {/* Outbound Calls */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  Prospect & Client Calls
                </span>
                <span className="text-slate-400">
                  <strong className="text-white">{rep.activities.callsCount}</strong> / {rep.activities.callsTarget} ({callsProgress.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${callsProgress >= 100 ? 'bg-emerald-400' : 'bg-cyan-500'}`}
                  style={{ width: `${Math.min(100, callsProgress)}%` }}
                />
              </div>
            </div>

            {/* Product Demos */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Tv className="w-3.5 h-3.5 text-indigo-400" />
                  Product Demonstrations Held
                </span>
                <span className="text-slate-400">
                  <strong className="text-white">{rep.activities.demosHeld}</strong> / {rep.activities.demosTarget} ({demosProgress.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${demosProgress >= 100 ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min(100, demosProgress)}%` }}
                />
              </div>
            </div>

            {/* Proposals Sent */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Proposals & Commercial Offers
                </span>
                <span className="text-slate-400">
                  <strong className="text-white">{rep.activities.proposalsSent}</strong> / {rep.activities.proposalsTarget} ({proposalsProgress.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${proposalsProgress >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, proposalsProgress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Historical Consistency */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Quarterly Quota History & Track Record</span>
          </h4>

          <div className="space-y-3 text-xs">
            {rep.quarterlyHistory.map((q) => {
              const qAttainment = (q.achieved / q.target) * 100;
              const isQWon = qAttainment >= 100;

              return (
                <div key={q.quarter} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white">{q.quarter}</span>
                    <span className={`font-bold ${isQWon ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {qAttainment.toFixed(1)}% Attained
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5">
                    <span>Target: {formatCurrency(q.target, true)}</span>
                    <span className="text-slate-200">Closed: {formatCurrency(q.achieved, true)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${isQWon ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(100, qAttainment)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Active Deals Owned by this Rep */}
      <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>Active Pipeline Opportunities ({openDeals.length} Deals In Progress)</span>
        </h4>

        {openDeals.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">No open pipeline deals for this representative currently.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 font-semibold border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2 px-2.5">Opportunity</th>
                  <th className="py-2 px-2.5">Client</th>
                  <th className="py-2 px-2.5">Product</th>
                  <th className="py-2 px-2.5">Deal Value</th>
                  <th className="py-2 px-2.5">Stage</th>
                  <th className="py-2 px-2.5">Probability</th>
                  <th className="py-2 px-2.5 text-right">Target Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {openDeals.map((d) => {
                  const meta = STAGE_META[d.stage];
                  return (
                    <tr key={d.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2.5 px-2.5 font-semibold text-white">{d.title}</td>
                      <td className="py-2.5 px-2.5 text-slate-300">{d.client}</td>
                      <td className="py-2.5 px-2.5 text-slate-400">{d.product}</td>
                      <td className="py-2.5 px-2.5 font-bold text-indigo-400">{formatCurrency(d.amount)}</td>
                      <td className="py-2.5 px-2.5">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                          style={{ color: meta.color, borderColor: `${meta.color}40`, backgroundColor: `${meta.color}15` }}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-300">{d.probability}%</td>
                      <td className="py-2.5 px-2.5 text-right text-slate-400">{d.expectedCloseDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
