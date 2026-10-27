import React from 'react';
import { 
  TrendingUp, 
  Play, 
  Pause, 
  PlusCircle, 
  FileSpreadsheet, 
  Calendar, 
  Users,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenNewDeal: () => void;
  onOpenReportModal: () => void;
  activeView: 'dashboard' | 'forecast' | 'reps' | 'reports';
  setActiveView: (view: 'dashboard' | 'forecast' | 'reps' | 'reports') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedTeam,
  setSelectedTeam,
  isSimulating,
  setIsSimulating,
  onOpenNewDeal,
  onOpenReportModal,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white font-display">
                  Sales Management Dashboard
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Real-Time Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Tuesday, September 22, 2026</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Fiscal Q3 2026 • 8 Days Left</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 self-start lg:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeView === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Overview & Pipeline
            </button>
            <button
              onClick={() => setActiveView('forecast')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'forecast'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              12-Month Forecast
            </button>
            <button
              onClick={() => setActiveView('reps')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'reps'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team & Individual KPIs
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'reports'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Custom Reports
            </button>
          </div>

          {/* Quick Actions & Live Simulation Switcher */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Team Filter */}
            <div className="relative">
              <select
                aria-label="Filter by Team"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 px-3 py-1.5 pr-8 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Divisions (Global)</option>
                <option value="Enterprise">Enterprise Team</option>
                <option value="Mid-Market">Mid-Market Team</option>
                <option value="SMB">SMB & Commercial</option>
              </select>
            </div>

            {/* Live Deals Simulation Button */}
            <button
              onClick={() => setIsSimulating((prev) => !prev)}
              title={isSimulating ? "Pause real-time deal simulation" : "Start real-time deal simulation"}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isSimulating
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3 h-3 text-emerald-400" />
                  <span>Live Feed: On</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-slate-400" />
                  <span>Live Feed: Paused</span>
                </>
              )}
            </button>

            {/* Log Deal Modal */}
            <button
              onClick={onOpenNewDeal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Deal</span>
            </button>

            {/* Report Generator Modal */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Report Builder</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
