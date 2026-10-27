import React, { useState, useEffect } from 'react';
import { 
  INITIAL_REPS, 
  INITIAL_MONTHLY_REVENUE, 
  INITIAL_DEALS, 
  generate12MonthForecast 
} from './data/mockSalesData';
import { SalesRep, MonthlyRevenueRecord, Deal } from './types';
import { Header } from './components/Header';
import { RevenueMetricsOverview } from './components/RevenueMetricsOverview';
import { MonthlyRevenueChart } from './components/MonthlyRevenueChart';
import { Forecast12Months } from './components/Forecast12Months';
import { TeamPerformance } from './components/TeamPerformance';
import { IndividualKPITracker } from './components/IndividualKPITracker';
import { PipelineDistributionChart } from './components/PipelineDistributionChart';
import { LiveDealsFeed } from './components/LiveDealsFeed';
import { CustomReportModal } from './components/CustomReportModal';
import { NewDealModal } from './components/NewDealModal';
import { EditQuotaModal } from './components/EditQuotaModal';
import { Sparkles, Trophy, Bell, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from './utils/formatters';

export default function App() {
  // Primary State
  const [reps, setReps] = useState<SalesRep[]>(INITIAL_REPS);
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueRecord[]>(INITIAL_MONTHLY_REVENUE);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  
  // Navigation & Filter State
  const [activeView, setActiveView] = useState<'dashboard' | 'forecast' | 'reps' | 'reports'>('dashboard');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedRepId, setSelectedRepId] = useState<string>('rep-1');
  
  // Modals State
  const [isNewDealOpen, setIsNewDealOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);

  // Real-time Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [toastNotification, setToastNotification] = useState<{ message: string; sub?: string } | null>({
    message: 'Real-time telemetry active',
    sub: 'Live deal streaming and revenue updates enabled for September 2026',
  });

  // Current Month Data
  const currentMonth = monthlyData[monthlyData.length - 1];

  // Auto-dismiss toast
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Real-time Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick a random rep to log activity or progress a deal
      const randomRepIndex = Math.floor(Math.random() * reps.length);
      const rep = reps[randomRepIndex];

      const eventType = Math.random();

      if (eventType > 0.65) {
        // Increment activities (Call or demo)
        setReps((prevReps) =>
          prevReps.map((r, i) => {
            if (i === randomRepIndex) {
              const addCalls = Math.floor(Math.random() * 3) + 1;
              return {
                ...r,
                activities: {
                  ...r.activities,
                  callsCount: r.activities.callsCount + addCalls,
                },
              };
            }
            return r;
          })
        );
      } else if (eventType > 0.35) {
        // Small expansion or contract close
        const addedRevenue = Math.floor(Math.random() * 8 + 3) * 1000; // $3k - $10k
        setReps((prevReps) =>
          prevReps.map((r, i) => {
            if (i === randomRepIndex) {
              return {
                ...r,
                revenueClosed: r.revenueClosed + addedRevenue,
                totalPipelineValue: Math.max(0, r.totalPipelineValue - addedRevenue),
              };
            }
            return r;
          })
        );

        // Update current monthly revenue
        setMonthlyData((prevMonths) => {
          const updated = [...prevMonths];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            ...updated[lastIdx],
            actualRevenue: updated[lastIdx].actualRevenue + addedRevenue,
            expansionRevenue: updated[lastIdx].expansionRevenue + addedRevenue,
          };
          return updated;
        });

        setToastNotification({
          message: `Deal Closed: ${rep.name} booked ${formatCurrency(addedRevenue)}`,
          sub: 'Updated monthly revenue and individual quota attainment',
        });
      }
    }, 14000); // Trigger every 14 seconds

    return () => clearInterval(interval);
  }, [isSimulating, reps]);

  // Handler: Advance Deal Stage
  const handleAdvanceDeal = (dealId: string, nextStage: Deal['stage']) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    setDeals(prevDeals =>
      prevDeals.map(d => {
        if (d.id === dealId) {
          const isNowWon = nextStage === 'closed_won';
          return {
            ...d,
            stage: nextStage,
            probability: isNowWon ? 100 : d.probability,
            closedDate: isNowWon ? '2026-09-22' : d.closedDate,
          };
        }
        return d;
      })
    );

    // If deal won, book revenue to rep and monthly total
    if (nextStage === 'closed_won') {
      setReps(prevReps =>
        prevReps.map(r => {
          if (r.id === deal.repId) {
            return {
              ...r,
              revenueClosed: r.revenueClosed + deal.amount,
              dealsWonCount: r.dealsWonCount + 1,
              totalPipelineValue: Math.max(0, r.totalPipelineValue - deal.amount),
            };
          }
          return r;
        })
      );

      setMonthlyData(prevMonths => {
        const updated = [...prevMonths];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          actualRevenue: updated[lastIdx].actualRevenue + deal.amount,
          newBusinessRevenue: updated[lastIdx].newBusinessRevenue + deal.amount,
          dealsClosed: updated[lastIdx].dealsClosed + 1,
        };
        return updated;
      });

      setToastNotification({
        message: `🎉 Deal Won! ${deal.title}`,
        sub: `${formatCurrency(deal.amount)} added to ${deal.repName}'s quota attainment`,
      });
    }
  };

  // Handler: Add New Deal
  const handleAddDeal = (dealData: Omit<Deal, 'id'>) => {
    const newId = `deal-${Date.now()}`;
    const newDeal: Deal = {
      ...dealData,
      id: newId,
    };

    setDeals(prev => [newDeal, ...prev]);

    // If added directly as Closed Won
    if (newDeal.stage === 'closed_won') {
      setReps(prevReps =>
        prevReps.map(r => {
          if (r.id === newDeal.repId) {
            return {
              ...r,
              revenueClosed: r.revenueClosed + newDeal.amount,
              dealsWonCount: r.dealsWonCount + 1,
            };
          }
          return r;
        })
      );

      setMonthlyData(prevMonths => {
        const updated = [...prevMonths];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          actualRevenue: updated[lastIdx].actualRevenue + newDeal.amount,
          dealsClosed: updated[lastIdx].dealsClosed + 1,
        };
        return updated;
      });
    } else {
      // Add to rep's active pipeline
      setReps(prevReps =>
        prevReps.map(r => {
          if (r.id === newDeal.repId) {
            return {
              ...r,
              totalPipelineValue: r.totalPipelineValue + newDeal.amount,
            };
          }
          return r;
        })
      );
    }

    setToastNotification({
      message: `New Opportunity Logged: ${newDeal.title}`,
      sub: `${formatCurrency(newDeal.amount)} assigned to ${newDeal.repName}`,
    });
  };

  // Handler: Save Rep Quota
  const handleSaveQuota = (repId: string, newQuota: number) => {
    setReps(prevReps =>
      prevReps.map(r => {
        if (r.id === repId) {
          return {
            ...r,
            quota: newQuota,
          };
        }
        return r;
      })
    );

    setToastNotification({
      message: 'Representative Quota Target Updated',
      sub: `New target applied and pacing recalculated`,
    });
  };

  const forecastData = generate12MonthForecast(monthlyData, {
    scenario: 'baseline',
    growthRatePct: 2.8,
    churnRatePct: 1.8,
    winRateAdjustmentPct: 5.0,
    pipelineVelocityDays: 32,
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Toast Banner */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-start space-x-3 bg-slate-900 border border-indigo-500/40 p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-sm transition-all duration-300">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{toastNotification.message}</div>
            {toastNotification.sub && (
              <div className="text-[11px] text-slate-400 mt-0.5">{toastNotification.sub}</div>
            )}
          </div>
        </div>
      )}

      {/* Main App Top Navigation Bar */}
      <Header
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        onOpenNewDeal={() => setIsNewDealOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render View Depending on Tab */}
        {activeView === 'dashboard' && (
          <div>
            {/* Top-Level Real-Time Revenue & Team KPIs */}
            <RevenueMetricsOverview
              currentMonth={currentMonth}
              reps={reps}
              deals={deals}
              selectedTeam={selectedTeam}
            />

            {/* Monthly Revenue Chart: Trailing 12 Months */}
            <MonthlyRevenueChart monthlyData={monthlyData} />

            {/* Funnel & Live Activity Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PipelineDistributionChart deals={deals} selectedTeam={selectedTeam} />
              <LiveDealsFeed 
                deals={deals} 
                onAdvanceDeal={handleAdvanceDeal} 
                selectedTeam={selectedTeam} 
              />
            </div>
          </div>
        )}

        {activeView === 'forecast' && (
          <div>
            <Forecast12Months historicalData={monthlyData} />
            <MonthlyRevenueChart monthlyData={monthlyData} />
          </div>
        )}

        {activeView === 'reps' && (
          <div>
            {/* Team Leaderboard */}
            <TeamPerformance
              reps={reps}
              selectedTeam={selectedTeam}
              onSelectRep={(rep) => {
                setSelectedRepId(rep.id);
                // Smooth scroll to individual tracker
                const el = document.getElementById('individual-kpi-scorecard');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onEditRepQuota={(rep) => setEditingRep(rep)}
            />

            {/* Individual KPI Scorecard */}
            <div id="individual-kpi-scorecard">
              <IndividualKPITracker
                reps={reps}
                deals={deals}
                selectedRepId={selectedRepId}
                onSelectRepId={setSelectedRepId}
                onEditQuota={(rep) => setEditingRep(rep)}
              />
            </div>
          </div>
        )}

        {activeView === 'reports' && (
          <div>
            {/* Dedicated Custom Reports View */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">
                    Executive Reports & Analysis Hub
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate customized board-ready sales summaries, audit individual rep performance, and export datasets.
                  </p>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
                >
                  Open Full Report Builder
                </button>
              </div>

              {/* Quick Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div 
                  onClick={() => setIsReportModalOpen(true)}
                  className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all group"
                >
                  <div className="font-bold text-white group-hover:text-indigo-400 text-sm mb-1">
                    Representative Quota & Win Rates
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Full breakdown of quotas, revenue generated, win rates, sales cycles, and call/demo counts.
                  </p>
                  <span className="text-indigo-400 font-semibold text-[11px] group-hover:underline">
                    Generate Rep Report →
                  </span>
                </div>

                <div 
                  onClick={() => setIsReportModalOpen(true)}
                  className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all group"
                >
                  <div className="font-bold text-white group-hover:text-cyan-400 text-sm mb-1">
                    Trailing 12-Month Financial Summary
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Monthly recurring revenue, new business ARR, customer expansion, and gross revenue churn.
                  </p>
                  <span className="text-cyan-400 font-semibold text-[11px] group-hover:underline">
                    Generate Financial Report →
                  </span>
                </div>

                <div 
                  onClick={() => setIsReportModalOpen(true)}
                  className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition-all group"
                >
                  <div className="font-bold text-white group-hover:text-emerald-400 text-sm mb-1">
                    12-Month Predictive Forecast
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Machine-weighted future 12 months (Oct 2026 – Sep 2027) with confidence intervals and quota variance.
                  </p>
                  <span className="text-emerald-400 font-semibold text-[11px] group-hover:underline">
                    Generate Forecast Report →
                  </span>
                </div>
              </div>
            </div>

            {/* Include the interactive forecast view and rep leaderboard for easy viewing inside the reports tab */}
            <Forecast12Months historicalData={monthlyData} />
            <TeamPerformance
              reps={reps}
              selectedTeam={selectedTeam}
              onSelectRep={(rep) => {
                setSelectedRepId(rep.id);
                setActiveView('reps');
              }}
              onEditRepQuota={(rep) => setEditingRep(rep)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 bg-slate-950/80 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400">Sales Ops Engine v3.4 • Real-Time Synchronization Active</span>
          </div>
          <div className="text-slate-500">
            Confidential Internal Sales Performance Dashboard
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewDealModal
        isOpen={isNewDealOpen}
        onClose={() => setIsNewDealOpen(false)}
        reps={reps}
        onAddDeal={handleAddDeal}
      />

      <CustomReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reps={reps}
        monthlyData={monthlyData}
        deals={deals}
        forecastData={forecastData}
      />

      <EditQuotaModal
        rep={editingRep}
        isOpen={!!editingRep}
        onClose={() => setEditingRep(null)}
        onSaveQuota={handleSaveQuota}
      />

    </div>
  );
}
