import React from 'react';
import { 
  Users, 
  Trophy, 
  ChevronRight, 
  Phone, 
  Tv, 
  FileText, 
  TrendingUp, 
  Edit3, 
  ExternalLink 
} from 'lucide-react';
import { SalesRep } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface TeamPerformanceProps {
  reps: SalesRep[];
  selectedTeam: string;
  onSelectRep: (rep: SalesRep) => void;
  onEditRepQuota: (rep: SalesRep) => void;
}

export const TeamPerformance: React.FC<TeamPerformanceProps> = ({
  reps,
  selectedTeam,
  onSelectRep,
  onEditRepQuota,
}) => {
  // Filter and sort by revenue closed descending
  const filteredReps = (selectedTeam === 'All' 
    ? reps 
    : reps.filter(r => r.team === selectedTeam)
  ).sort((a, b) => (b.revenueClosed / b.quota) - (a.revenueClosed / a.quota));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-display">
              Team Performance Leaderboard & Quota Attainment
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time monthly revenue generated vs quotas, win rates, and activity metrics by representative.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>&gt;100% Attained</span>
          </span>
          <span className="flex items-center gap-1.5 ml-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>70-99% Pacing</span>
          </span>
          <span className="flex items-center gap-1.5 ml-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>&lt;70% Attention</span>
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3.5 text-center w-12">Rank</th>
              <th className="py-3 px-3.5">Representative</th>
              <th className="py-3 px-3.5">Division</th>
              <th className="py-3 px-3.5">Quota Progress</th>
              <th className="py-3 px-3.5">Closed (MTD)</th>
              <th className="py-3 px-3.5">Win Rate</th>
              <th className="py-3 px-3.5">Pipeline Value</th>
              <th className="py-3 px-3.5">Key Activities</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {filteredReps.map((rep, index) => {
              const attainment = (rep.revenueClosed / rep.quota) * 100;
              const isOver100 = attainment >= 100;
              const isPacingWell = attainment >= 70;

              return (
                <tr 
                  key={rep.id} 
                  className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectRep(rep)}
                >
                  {/* Rank */}
                  <td className="py-3 px-3.5 text-center">
                    {index === 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        1
                      </span>
                    ) : index === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 font-bold border border-slate-400/30">
                        2
                      </span>
                    ) : index === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-bold border border-amber-700/30">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">{index + 1}</span>
                    )}
                  </td>

                  {/* Rep Info */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={rep.avatar} 
                        alt={rep.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                          {rep.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{rep.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Team badge */}
                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {rep.team}
                    </span>
                  </td>

                  {/* Quota Progress Bar */}
                  <td className="py-3 px-3.5 min-w-[170px]">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold ${isOver100 ? 'text-emerald-400' : isPacingWell ? 'text-indigo-400' : 'text-amber-400'}`}>
                        {attainment.toFixed(1)}%
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        of {formatCurrency(rep.quota, true)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isOver100 
                            ? 'bg-emerald-400' 
                            : isPacingWell 
                            ? 'bg-indigo-500' 
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.min(100, attainment)}%` }}
                      />
                    </div>
                  </td>

                  {/* Closed MTD */}
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-white text-sm">
                      {formatCurrency(rep.revenueClosed)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {rep.dealsWonCount} won • {rep.dealsLostCount} lost
                    </div>
                  </td>

                  {/* Win Rate */}
                  <td className="py-3 px-3.5">
                    <span className={`font-semibold text-xs ${rep.winRate >= 70 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {rep.winRate.toFixed(1)}%
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {rep.avgSalesCycleDays}d cycle
                    </span>
                  </td>

                  {/* Pipeline Value */}
                  <td className="py-3 px-3.5">
                    <div className="font-medium text-slate-200">
                      {formatCurrency(rep.totalPipelineValue, true)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {(rep.totalPipelineValue / rep.quota).toFixed(1)}x coverage
                    </div>
                  </td>

                  {/* Key Activities */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2.5 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1" title={`${rep.activities.callsCount} calls out of ${rep.activities.callsTarget} target`}>
                        <Phone className="w-3 h-3 text-cyan-400" />
                        {rep.activities.callsCount}
                      </span>
                      <span className="flex items-center gap-1" title={`${rep.activities.demosHeld} demos held`}>
                        <Tv className="w-3 h-3 text-indigo-400" />
                        {rep.activities.demosHeld}
                      </span>
                      <span className="flex items-center gap-1" title={`${rep.activities.proposalsSent} proposals sent`}>
                        <FileText className="w-3 h-3 text-amber-400" />
                        {rep.activities.proposalsSent}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditRepQuota(rep)}
                        title="Edit Quota Target"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectRep(rep)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-[11px] font-medium transition-colors"
                      >
                        <span>KPI Scorecard</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
