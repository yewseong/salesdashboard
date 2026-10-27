import React, { useState } from 'react';
import { X, PlusCircle, DollarSign, Building2, User, Calendar, ShieldCheck } from 'lucide-react';
import { SalesRep, Deal } from '../types';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  reps: SalesRep[];
  onAddDeal: (deal: Omit<Deal, 'id'>) => void;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({
  isOpen,
  onClose,
  reps,
  onAddDeal,
}) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState<number>(45000);
  const [repId, setRepId] = useState<string>(reps[0]?.id || 'rep-1');
  const [stage, setStage] = useState<Deal['stage']>('proposal');
  const [probability, setProbability] = useState<number>(60);
  const [expectedCloseDate, setExpectedCloseDate] = useState('2026-10-15');
  const [product, setProduct] = useState<Deal['product']>('Core Platform');
  const [segment, setSegment] = useState<Deal['segment']>('Enterprise');
  const [region, setRegion] = useState<Deal['region']>('North America');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || amount <= 0) return;

    const selectedRep = reps.find(r => r.id === repId);

    onAddDeal({
      title,
      client,
      amount,
      repId,
      repName: selectedRep?.name || 'Sales Rep',
      stage,
      probability: stage === 'closed_won' ? 100 : probability,
      expectedCloseDate,
      closedDate: stage === 'closed_won' ? '2026-09-22' : undefined,
      product,
      segment,
      region,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Log New Pipeline Opportunity</h3>
              <p className="text-xs text-slate-400">Add an active deal or register a newly closed contract in real-time.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Opportunity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Financial Analytics Suite"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Client / Account Name</label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Apex Financial Corp"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Deal Value (USD)</label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Representative</label>
              <select
                value={repId}
                onChange={(e) => setRepId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {reps.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.team})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Deal Stage</label>
              <select
                value={stage}
                onChange={(e) => {
                  const newStage = e.target.value as Deal['stage'];
                  setStage(newStage);
                  if (newStage === 'closed_won') setProbability(100);
                  else if (newStage === 'negotiation') setProbability(85);
                  else if (newStage === 'proposal') setProbability(60);
                  else if (newStage === 'demo') setProbability(45);
                  else setProbability(25);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="discovery">Discovery</option>
                <option value="qualification">Qualification</option>
                <option value="demo">Demo Completed</option>
                <option value="proposal">Proposal Sent</option>
                <option value="negotiation">In Negotiation</option>
                <option value="closed_won">Closed Won (Booked Revenue)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Expected Close Date</label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Suite</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value as Deal['product'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Core Platform">Core Platform</option>
                <option value="Enterprise Suite">Enterprise Suite</option>
                <option value="Add-on Modules">Add-on Modules</option>
                <option value="Managed Services">Managed Services</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as Deal['segment'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="SMB">SMB</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Deal['region'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="APAC">APAC</option>
                <option value="LATAM">LATAM</option>
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              Confirm & Sync Deal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
