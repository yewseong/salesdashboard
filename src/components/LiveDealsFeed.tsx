import React, { useState } from 'react';
import { 
  Deal, 
  SalesRep 
} from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Tag, 
  TrendingUp, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { STAGE_META } from '../data/mockSalesData';
import { formatCurrency } from '../utils/formatters';

interface LiveDealsFeedProps {
  deals: Deal[];
  onAdvanceDeal: (dealId: string, nextStage: Deal['stage']) => void;
  selectedTeam: string;
}

export const LiveDealsFeed: React.FC<LiveDealsFeedProps> = ({
  deals,
  onAdvanceDeal,
  selectedTeam,
}) => {
  const [filterStage, setFilterStage] = useState<string>('all');

  const filteredDeals = deals.filter(d => {
    if (selectedTeam !== 'All' && d.segment !== selectedTeam) return false;
    if (filterStage !== 'all' && d.stage !== filterStage) return false;
    return true;
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold text-white font-display">
              Live Deals Activity & Velocity Feed
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time opportunity movement across stages and recent contract executions.
          </p>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStage('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterStage === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Stages
          </button>
          <button
            onClick={() => setFilterStage('negotiation')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterStage === 'negotiation'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Negotiation
          </button>
          <button
            onClick={() => setFilterStage('proposal')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterStage === 'proposal'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Proposal Sent
          </button>
          <button
            onClick={() => setFilterStage('closed_won')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterStage === 'closed_won'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Won Deals
          </button>
        </div>
      </div>

      {/* Deals List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No deals found for current filter criteria.
          </div>
        ) : (
          filteredDeals.map((deal) => {
            const meta = STAGE_META[deal.stage];
            const isWon = deal.stage === 'closed_won';

            return (
              <div 
                key={deal.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                {/* Deal details */}
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    isWon ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {isWon ? <CheckCircle2 className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-xs">{deal.title}</h4>
                      <span 
                        className="px-2 py-0.2 rounded text-[10px] font-semibold border"
                        style={{ color: meta.color, borderColor: `${meta.color}40`, backgroundColor: `${meta.color}15` }}
                      >
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded">
                        {deal.segment}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-slate-300 font-medium">{deal.client}</span>
                      <span className="text-slate-600">•</span>
                      <span>Owner: <strong className="text-slate-300">{deal.repName}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Target: {deal.expectedCloseDate}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Quick Stage Advance Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 self-stretch sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-display">
                      {formatCurrency(deal.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isWon ? 'Revenue Booked' : `${deal.probability}% Probable (${formatCurrency(Math.round(deal.amount * (deal.probability / 100)), true)})`}
                    </div>
                  </div>

                  {/* Stage Advancement button */}
                  {!isWon && deal.stage !== 'closed_lost' && (
                    <div className="flex items-center gap-1.5">
                      {deal.stage === 'negotiation' ? (
                        <button
                          onClick={() => onAdvanceDeal(deal.id, 'closed_won')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Close Won</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const nextStageMap: Record<Deal['stage'], Deal['stage']> = {
                              discovery: 'qualification',
                              qualification: 'demo',
                              demo: 'proposal',
                              proposal: 'negotiation',
                              negotiation: 'closed_won',
                              closed_won: 'closed_won',
                              closed_lost: 'closed_lost',
                            };
                            onAdvanceDeal(deal.id, nextStageMap[deal.stage]);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-medium text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
