import React, { useState, useEffect } from 'react';
import { Startup, Investor } from '../types';
import { EDUBOT_GLOBAL_VENTURES_RESULT } from '../data/presetData';
import { Grid, Sparkles, Award, ArrowUpRight, CheckCircle2, Search, Filter } from 'lucide-react';

interface BatchMatrixProps {
  startups: Startup[];
  investors: Investor[];
}

export const BatchMatrix: React.FC<BatchMatrixProps> = ({ startups, investors }) => {
  const [selectedCell, setSelectedCell] = useState<{ startupId: string; investorId: string } | null>(null);

  useEffect(() => {
    if (startups.length > 0 && investors.length > 0 && !selectedCell) {
      setSelectedCell({
        startupId: startups[0].id,
        investorId: investors[0].id,
      });
    }
  }, [startups, investors]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate heuristic score for matrix visualization
  const getMatrixScore = (startupId: string, investorId: string): number => {
    if (startupId === 'startup-edubot' && investorId === 'investor-global-ventures') {
      return 95;
    }
    const s = startups.find((p) => p.id === startupId);
    const i = investors.find((p) => p.id === investorId);
    if (!s || !i) return 50;

    let score = 60;
    if (i.targetSectors.includes(s.sector)) score += 20;
    if (i.investmentStages.includes(s.stage)) score += 10;
    if (s.fundingNeededVal >= i.ticketMin && s.fundingNeededVal <= i.ticketMax) score += 10;
    return score;
  };

  const filteredStartups = startups.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Ma Trận Ghép Đôi DAVAS 2026</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tổng quan bản đồ tương thích giữa danh sách Startup và Quỹ Đầu Tư tại sự kiện
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên/lĩnh vực..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-3 text-xs font-semibold text-slate-400">Startup \ Quỹ VC</th>
              {investors.map((inv) => (
                <th key={inv.id} className="p-3 text-xs font-bold text-white text-center">
                  <div className="flex flex-col items-center">
                    <span>{inv.name}</span>
                    <span className="text-[10px] text-amber-400 font-normal">
                      {inv.targetSectors.join(', ')}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStartups.map((st) => (
              <tr key={st.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                <td className="p-3">
                  <div>
                    <div className="font-bold text-sm text-white">{st.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {st.sector} • {st.stage} ({st.fundingNeeded})
                    </div>
                  </div>
                </td>

                {investors.map((inv) => {
                  const score = getMatrixScore(st.id, inv.id);
                  const isSelected =
                    selectedCell?.startupId === st.id && selectedCell?.investorId === inv.id;

                  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                  if (score >= 90) badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                  else if (score >= 80) badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';

                  return (
                    <td key={inv.id} className="p-3 text-center">
                      <button
                        onClick={() => setSelectedCell({ startupId: st.id, investorId: inv.id })}
                        className={`px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${badgeColor} ${
                          isSelected ? 'ring-2 ring-amber-400 scale-105' : 'hover:scale-102'
                        }`}
                      >
                        {score} điểm
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Detail Drawer/Card */}
      {selectedCell && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Chi Tiết Tương Thích: {startups.find((s) => s.id === selectedCell.startupId)?.name} x{' '}
              {investors.find((i) => i.id === selectedCell.investorId)?.name}
            </h3>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              {getMatrixScore(selectedCell.startupId, selectedCell.investorId)}/100 Điểm
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedCell.startupId === 'startup-edubot' &&
            selectedCell.investorId === 'investor-global-ventures'
              ? EDUBOT_GLOBAL_VENTURES_RESULT.reason
              : 'Hai bên có sự phù hợp tốt về danh mục lĩnh vực đầu tư và hạn mục số vốn cần gọi. Rất thuận lợi để sắp xếp cuộc đối thoại trực tiếp.'}
          </p>
        </div>
      )}
    </div>
  );
};
