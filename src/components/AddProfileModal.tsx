import React, { useState } from 'react';
import { Startup, Investor } from '../types';
import { X, Building2, UserCheck, Plus } from 'lucide-react';

interface AddProfileModalProps {
  type: 'startup' | 'investor';
  onClose: () => void;
  onAddStartup: (s: Startup) => void;
  onAddInvestor: (i: Investor) => void;
}

export const AddProfileModal: React.FC<AddProfileModalProps> = ({
  type,
  onClose,
  onAddStartup,
  onAddInvestor,
}) => {
  const [startupForm, setStartupForm] = useState({
    name: '',
    sector: 'EdTech',
    stage: 'Seed',
    fundingNeeded: '$500,000',
    description: '',
  });

  const [investorForm, setInvestorForm] = useState({
    name: '',
    targetSectors: 'EdTech, AI, Fintech',
    investmentStages: 'Seed, Series A',
    ticketSize: '$300,000 - $1,000,000',
    thesis: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'startup') {
      if (!startupForm.name || !startupForm.description) return;
      onAddStartup({
        id: `startup-${Date.now()}`,
        name: startupForm.name,
        sector: startupForm.sector,
        stage: startupForm.stage,
        fundingNeeded: startupForm.fundingNeeded,
        fundingNeededVal: 500000,
        description: startupForm.description,
      });
    } else {
      if (!investorForm.name || !investorForm.thesis) return;
      onAddInvestor({
        id: `investor-${Date.now()}`,
        name: investorForm.name,
        targetSectors: investorForm.targetSectors.split(',').map((s) => s.trim()),
        investmentStages: investorForm.investmentStages.split(',').map((s) => s.trim()),
        ticketSize: investorForm.ticketSize,
        ticketMin: 300000,
        ticketMax: 1000000,
        thesis: investorForm.thesis,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          {type === 'startup' ? (
            <Building2 className="w-5 h-5 text-indigo-400" />
          ) : (
            <UserCheck className="w-5 h-5 text-amber-400" />
          )}
          <h3 className="text-lg font-bold">
            Thêm {type === 'startup' ? 'Startup' : 'Nhà Đầu Tư / Quỹ VC'} Mới
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {type === 'startup' ? (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Tên Startup</label>
                <input
                  type="text"
                  required
                  value={startupForm.name}
                  onChange={(e) => setStartupForm({ ...startupForm, name: e.target.value })}
                  placeholder="Ví dụ: EduBot"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Lĩnh vực</label>
                  <input
                    type="text"
                    value={startupForm.sector}
                    onChange={(e) => setStartupForm({ ...startupForm, sector: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Giai đoạn</label>
                  <input
                    type="text"
                    value={startupForm.stage}
                    onChange={(e) => setStartupForm({ ...startupForm, stage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Số tiền cần gọi</label>
                <input
                  type="text"
                  value={startupForm.fundingNeeded}
                  onChange={(e) => setStartupForm({ ...startupForm, fundingNeeded: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  required
                  value={startupForm.description}
                  onChange={(e) => setStartupForm({ ...startupForm, description: e.target.value })}
                  placeholder="Mô tả giải pháp sản phẩm..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Tên Quỹ VC / Investor</label>
                <input
                  type="text"
                  required
                  value={investorForm.name}
                  onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })}
                  placeholder="Ví dụ: Global Ventures"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lĩnh vực quan tâm (cách bởi phẩy)</label>
                <input
                  type="text"
                  value={investorForm.targetSectors}
                  onChange={(e) => setInvestorForm({ ...investorForm, targetSectors: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Giai đoạn đầu tư</label>
                  <input
                    type="text"
                    value={investorForm.investmentStages}
                    onChange={(e) =>
                      setInvestorForm({ ...investorForm, investmentStages: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ticket size</label>
                  <input
                    type="text"
                    value={investorForm.ticketSize}
                    onChange={(e) => setInvestorForm({ ...investorForm, ticketSize: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Khẩu vị / Triết lý đầu tư</label>
                <textarea
                  rows={3}
                  required
                  value={investorForm.thesis}
                  onChange={(e) => setInvestorForm({ ...investorForm, thesis: e.target.value })}
                  placeholder="Ví dụ: Ưa thích các startup ứng dụng AI..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Hồ Sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
