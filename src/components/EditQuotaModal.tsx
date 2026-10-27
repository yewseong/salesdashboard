import React, { useState } from 'react';
import { X, Target, DollarSign, Check } from 'lucide-react';
import { SalesRep } from '../types';
import { formatCurrency } from '../utils/formatters';

interface EditQuotaModalProps {
  rep: SalesRep | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveQuota: (repId: string, newQuota: number) => void;
}

export const EditQuotaModal: React.FC<EditQuotaModalProps> = ({
  rep,
  isOpen,
  onClose,
  onSaveQuota,
}) => {
  if (!isOpen || !rep) return null;

  const [quota, setQuota] = useState<number>(rep.quota);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quota > 0) {
      onSaveQuota(rep.id, quota);
      onClose();
    }
  };

  const currentAttainment = (rep.revenueClosed / quota) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Adjust Monthly Quota Target</h3>
              <p className="text-xs text-slate-400">{rep.name} • {rep.team}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Current Closed MTD:</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(rep.revenueClosed)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Quota:</span>
              <span className="text-white font-semibold">{formatCurrency(rep.quota)}</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
              <span>Recalculated Attainment:</span>
              <span className="text-indigo-400 font-bold">{currentAttainment.toFixed(1)}%</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              New Monthly Target Quota (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                $
              </div>
              <input
                type="number"
                min="10000"
                step="5000"
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div>
            <label className="block text-slate-400 text-[11px] mb-1.5">Quick Target Presets:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQuota(Math.round(rep.quota * 1.10))}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[11px] font-medium"
              >
                +10% ({formatCurrency(Math.round(rep.quota * 1.10), true)})
              </button>
              <button
                type="button"
                onClick={() => setQuota(Math.round(rep.quota * 1.25))}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[11px] font-medium"
              >
                +25% ({formatCurrency(Math.round(rep.quota * 1.25), true)})
              </button>
              <button
                type="button"
                onClick={() => setQuota(rep.revenueClosed)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[11px] font-medium"
              >
                Match MTD
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Update Target</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
