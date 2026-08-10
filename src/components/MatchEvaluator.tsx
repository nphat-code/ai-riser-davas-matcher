import React, { useState } from 'react';
import { Startup, Investor, MatchEvaluationResult } from '../types';
import { PRESET_STARTUPS, PRESET_INVESTORS } from '../data/presetData';
import { Sparkles, Building2, UserCheck, ArrowRightLeft, RefreshCw, AlertCircle, CheckCircle2, Copy, Check, Volume2, Code } from 'lucide-react';

interface MatchEvaluatorProps {
  onEvaluationComplete?: (result: MatchEvaluationResult) => void;
}

export const MatchEvaluator: React.FC<MatchEvaluatorProps> = ({ onEvaluationComplete }) => {
  // Selection mode: 'preset' or 'custom'
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');

  // Preset selections
  const [selectedStartupId, setSelectedStartupId] = useState<string>(PRESET_STARTUPS[0].id);
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>(PRESET_INVESTORS[0].id);

  // Custom startup inputs
  const [customStartup, setCustomStartup] = useState<Startup>({
    id: 'custom-startup',
    name: 'EduBot',
    sector: 'EdTech',
    stage: 'Seed',
    fundingNeeded: '$500,000',
    fundingNeededVal: 500000,
    description: 'Nền tảng học tiếng Anh qua AI',
  });

  // Custom investor inputs
  const [customInvestor, setCustomInvestor] = useState<Investor>({
    id: 'custom-investor',
    name: 'Global Ventures',
    targetSectors: ['EdTech', 'AI', 'Fintech'],
    investmentStages: ['Seed', 'Series A'],
    ticketSize: '$300,000 - $1,000,000',
    ticketMin: 300000,
    ticketMax: 1000000,
    thesis: 'Ưa thích các startup ứng dụng AI để cá nhân hóa',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchEvaluationResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const activeStartup =
    mode === 'preset'
      ? PRESET_STARTUPS.find((s) => s.id === selectedStartupId) || PRESET_STARTUPS[0]
      : customStartup;

  const activeInvestor =
    mode === 'preset'
      ? PRESET_INVESTORS.find((i) => i.id === selectedInvestorId) || PRESET_INVESTORS[0]
      : customInvestor;

  const handleRunEvaluation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startup: activeStartup,
          investor: activeInvestor,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể hoàn tất đánh giá. Vui lòng thử lại.');
      }

      const data: MatchEvaluationResult = await response.json();
      data.startupName = activeStartup.name;
      data.investorName = activeInvestor.name;
      data.evaluatedAt = new Date().toISOString();

      setResult(data);
      if (onEvaluationComplete) {
        onEvaluationComplete(data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi khi gọi AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyRawJson = () => {
    if (!result) return;
    const rawJson = JSON.stringify(
      {
        matching_score: result.matching_score,
        reason: result.reason,
        ice_breakers: result.ice_breakers,
      },
      null,
      2
    );
    navigator.clipboard.writeText(rawJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Mode Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Công Cụ Phân Tích Đánh Giá Cặp Đôi 1:1
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chọn từ hồ sơ có sẵn hoặc nhập thông tin bất kỳ để AI phân tích độ phù hợp ngay lập tức
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('preset')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'preset'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chọn Hồ Sơ DAVAS
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'custom'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nhập Tùy Chỉnh
          </button>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startup Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Thông Tin Startup</h3>
          </div>

          {mode === 'preset' ? (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-300 block">
                Chọn Startup từ danh sách:
              </label>
              <select
                value={selectedStartupId}
                onChange={(e) => setSelectedStartupId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRESET_STARTUPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.sector} - {s.stage} - {s.fundingNeeded})
                  </option>
                ))}
              </select>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Tên:</span>
                  <span className="font-bold text-white">{activeStartup.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Lĩnh vực:</span>
                  <span className="text-indigo-400 font-medium">{activeStartup.sector}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Giai đoạn & Vốn gọi:</span>
                  <span className="text-emerald-400 font-medium">
                    {activeStartup.stage} ({activeStartup.fundingNeeded})
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <span className="text-slate-400 block mb-1">Mô tả:</span>
                  {activeStartup.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tên Startup</label>
                <input
                  type="text"
                  value={customStartup.name}
                  onChange={(e) => setCustomStartup({ ...customStartup, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Lĩnh vực</label>
                  <input
                    type="text"
                    value={customStartup.sector}
                    onChange={(e) =>
                      setCustomStartup({ ...customStartup, sector: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Giai đoạn gọi vốn</label>
                  <input
                    type="text"
                    value={customStartup.stage}
                    onChange={(e) =>
                      setCustomStartup({ ...customStartup, stage: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Số tiền cần gọi</label>
                <input
                  type="text"
                  value={customStartup.fundingNeeded}
                  onChange={(e) =>
                    setCustomStartup({ ...customStartup, fundingNeeded: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Mô tả sản phẩm/mô hình</label>
                <textarea
                  rows={3}
                  value={customStartup.description}
                  onChange={(e) =>
                    setCustomStartup({ ...customStartup, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Investor Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Thông Tin Nhà Đầu Tư / Quỹ VC</h3>
          </div>

          {mode === 'preset' ? (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-300 block">
                Chọn Quỹ VC từ danh sách:
              </label>
              <select
                value={selectedInvestorId}
                onChange={(e) => setSelectedInvestorId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {PRESET_INVESTORS.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.targetSectors.join(', ')} - {i.ticketSize})
                  </option>
                ))}
              </select>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Tên Quỹ:</span>
                  <span className="font-bold text-white">{activeInvestor.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Lĩnh vực quan tâm:</span>
                  <span className="text-amber-400 font-medium">
                    {activeInvestor.targetSectors.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Giai đoạn & Ticket:</span>
                  <span className="text-emerald-400 font-medium">
                    {activeInvestor.investmentStages.join(', ')} ({activeInvestor.ticketSize})
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <span className="text-slate-400 block mb-1">Gu / Triết lý đầu tư:</span>
                  {activeInvestor.thesis}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tên Nhà Đầu Tư / Quỹ</label>
                <input
                  type="text"
                  value={customInvestor.name}
                  onChange={(e) => setCustomInvestor({ ...customInvestor, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Lĩnh vực quan tâm (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(customInvestor.targetSectors)
                      ? customInvestor.targetSectors.join(', ')
                      : customInvestor.targetSectors
                  }
                  onChange={(e) =>
                    setCustomInvestor({
                      ...customInvestor,
                      targetSectors: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Giai đoạn đầu tư</label>
                  <input
                    type="text"
                    value={
                      Array.isArray(customInvestor.investmentStages)
                        ? customInvestor.investmentStages.join(', ')
                        : customInvestor.investmentStages
                    }
                    onChange={(e) =>
                      setCustomInvestor({
                        ...customInvestor,
                        investmentStages: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ngân sách (Ticket Size)</label>
                  <input
                    type="text"
                    value={customInvestor.ticketSize}
                    onChange={(e) =>
                      setCustomInvestor({ ...customInvestor, ticketSize: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Khẩu vị / Triết lý đầu tư</label>
                <textarea
                  rows={3}
                  value={customInvestor.thesis}
                  onChange={(e) => setCustomInvestor({ ...customInvestor, thesis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trigger AI Evaluation Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRunEvaluation}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center space-x-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer text-base"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>AI Đang Phân Tích Dữ Liệu...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Phân Tích Bằng AI Chuyên Gia VC</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Display Evaluation Result */}
      {result && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Kết Quả AI Phân Tích
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {activeStartup.name} <span className="text-slate-500 font-normal">x</span>{' '}
                {activeInvestor.name}
              </h3>
            </div>

            <button
              onClick={handleCopyRawJson}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all"
            >
              {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              <span>{copiedJson ? 'Đã sao chép' : 'Sao chép JSON'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score */}
            <div className="md:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold mb-2">
                Độ Phù Hợp (Matching Score)
              </span>
              <div className="text-5xl font-black text-emerald-400 tracking-tight">
                {result.matching_score}
                <span className="text-lg text-slate-500 font-bold">/100</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {result.recommendation}
              </p>
            </div>

            {/* Reason */}
            <div className="md:col-span-8 bg-slate-950 p-6 rounded-2xl border border-indigo-500/30 space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                Lý Do Phù Hợp (&lt; 50 từ):
              </span>
              <p className="text-slate-200 text-base leading-relaxed italic font-medium">
                "{result.reason}"
              </p>
            </div>
          </div>

          {/* Ice Breakers */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 3 Câu Hỏi Bắt Đầu Cuộc Trò Chuyện (Ice Breakers):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.ice_breakers.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{q}"
                  </p>
                  <button
                    onClick={() => handleCopyQuestion(q, idx)}
                    className="self-end text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === idx ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <span className="text-slate-400 font-mono text-[11px]">Dữ liệu định dạng JSON:</span>
            <pre className="bg-slate-900 p-3 rounded text-emerald-300 font-mono overflow-x-auto">
              {JSON.stringify(
                {
                  matching_score: result.matching_score,
                  reason: result.reason,
                  ice_breakers: result.ice_breakers,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
