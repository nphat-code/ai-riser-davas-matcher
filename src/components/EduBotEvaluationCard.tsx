import React, { useState } from 'react';
import { EDUBOT_GLOBAL_VENTURES_RESULT, PRESET_STARTUPS, PRESET_INVESTORS } from '../data/presetData';
import {
  CheckCircle2,
  Copy,
  Check,
  Code,
  Volume2,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  Lightbulb,
  Building2,
  Briefcase,
  DollarSign,
  Target,
  Share2,
} from 'lucide-react';

interface EduBotEvaluationCardProps {
  onRunCustomMatch?: () => void;
}

export const EduBotEvaluationCard: React.FC<EduBotEvaluationCardProps> = ({
  onRunCustomMatch,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [bookedMeeting, setBookedMeeting] = useState<boolean>(false);

  const startup = PRESET_STARTUPS[0]; // EduBot
  const investor = PRESET_INVESTORS[0]; // Global Ventures
  const result = EDUBOT_GLOBAL_VENTURES_RESULT;

  const rawJsonOutput = JSON.stringify(
    {
      matching_score: result.matching_score,
      reason: result.reason,
      ice_breakers: result.ice_breakers,
    },
    null,
    2
  );

  const handleCopyQuestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyRawJson = () => {
    navigator.clipboard.writeText(rawJsonOutput);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleSpeak = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingIndex === index) {
        setSpeakingIndex(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner Intro */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đánh giá Trực tiếp DAVAS 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Phân Tích Độ Phù Hợp: <span className="text-indigo-300">EduBot</span> x{' '}
              <span className="text-amber-300">Global Ventures</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Báo cáo phân tích chuyên sâu bởi Chuyên gia VC Analyst về khả năng kết nối đầu tư 1:1 dựa trên Lĩnh vực, Giai đoạn, Ngân sách và Triết lý đầu tư.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyRawJson}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-emerald-500/30 shadow-lg transition-all cursor-pointer"
            >
              {copiedJson ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-emerald-400" />
              )}
              <span>{copiedJson ? 'Đã sao chép JSON' : 'Sao chép JSON'}</span>
            </button>

            {onRunCustomMatch && (
              <button
                onClick={onRunCustomMatch}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Ghép Cặp Khác</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profiles Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startup Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-lg">
                EB
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Startup Hồ Sơ
                </span>
                <h3 className="text-xl font-bold text-white">{startup.name}</h3>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-medium">
              Giai đoạn {startup.stage}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-300 bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Lĩnh vực:
              </span>
              <span className="font-semibold text-white">{startup.sector}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300 bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Vốn cần gọi:
              </span>
              <span className="font-semibold text-emerald-400">{startup.fundingNeeded}</span>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg text-slate-300 text-xs leading-relaxed">
              <span className="text-slate-400 font-medium block mb-1">Mô tả giải pháp:</span>
              {startup.description}
            </div>

            <div className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
              <span>Traction: {startup.traction}</span>
            </div>
          </div>
        </div>

        {/* Investor Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-lg">
                GV
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Nhà Đầu Tư / Quỹ VC
                </span>
                <h3 className="text-xl font-bold text-white">{investor.name}</h3>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-full text-xs font-medium">
              {investor.firmType}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-300 bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <Target className="w-3.5 h-3.5 text-amber-400" /> Lĩnh vực quan tâm:
              </span>
              <span className="font-semibold text-white">
                {investor.targetSectors.join(', ')}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300 bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Hạn mức Ticket Size:
              </span>
              <span className="font-semibold text-emerald-400">{investor.ticketSize}</span>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg text-slate-300 text-xs leading-relaxed">
              <span className="text-slate-400 font-medium block mb-1">Gu / Triết lý đầu tư:</span>
              {investor.thesis}
            </div>

            <div className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
              <span>Đại diện: {investor.representative}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Matching Evaluation Result Highlight Card */}
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Gauge Score */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-center relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Circular score display */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - result.matching_score / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tight">
                  {result.matching_score}
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                  / 100 Điểm
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Rất Phù Hợp (High Fit)</span>
              </span>
              <p className="text-xs text-slate-400 pt-1">{result.recommendation}</p>
            </div>
          </div>

          {/* Detailed Criteria Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Đánh Giá Tiêu Chí Thành Phần
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Lĩnh vực</span>
                    <span className="font-bold text-emerald-400">
                      {result.criteria_breakdown.sector_fit}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.criteria_breakdown.sector_fit}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Giai đoạn</span>
                    <span className="font-bold text-emerald-400">
                      {result.criteria_breakdown.stage_fit}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.criteria_breakdown.stage_fit}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Ticket Size</span>
                    <span className="font-bold text-emerald-400">
                      {result.criteria_breakdown.ticket_fit}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.criteria_breakdown.ticket_fit}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Gu/Triết lý</span>
                    <span className="font-bold text-emerald-400">
                      {result.criteria_breakdown.thesis_fit}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${result.criteria_breakdown.thesis_fit}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Concise Reason (Field 2) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Lý Do Đánh Giá (Reason)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                  &lt; 50 từ tiếng Việt
                </span>
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium italic">
                "{result.reason}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ice Breakers Section (Field 3) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">3 Câu Hỏi Bắt Đầu Cuộc Trò Chuyện (Ice Breakers)</h3>
              <p className="text-xs text-slate-400">
                Gợi ý cho Nhà đầu tư & Founder bắt đầu cuộc trao đổi 1:1 hiệu quả tại DAVAS
              </p>
            </div>
          </div>

          <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            Sắc bén & Đúng trọng tâm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.ice_breakers.map((question, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all relative group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSpeak(question, idx)}
                      title="Đọc câu hỏi"
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Volume2
                        className={`w-4 h-4 ${speakingIndex === idx ? 'text-amber-400 animate-bounce' : ''}`}
                      />
                    </button>
                    <button
                      onClick={() => handleCopyQuestion(question, idx)}
                      title="Sao chép câu hỏi"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">"{question}"</p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>{copiedIndex === idx ? '✓ Đã sao chép' : 'Bấm để sao chép'}</span>
                <span className="text-indigo-400">Mẫu hỏi VC</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON Code Format Accordion/Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Bắt Buộc Trả Về Định Dạng JSON Chuẩn (3 Trường):
            </h4>
          </div>
          <button
            onClick={handleCopyRawJson}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 transition-all"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Đã sao chép' : 'Sao chép JSON'}</span>
          </button>
        </div>

        <pre className="bg-slate-900 p-4 rounded-xl text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
          {rawJsonOutput}
        </pre>
      </div>

      {/* DAVAS 1:1 Booking Action Simulation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Xếp Lịch Gặp 1:1 Tại Sự Kiện DAVAS 2026</h4>
            <p className="text-xs text-slate-300">
              Gửi đề xuất ghép cặp cho Ban Tổ Chức để chuẩn bị bàn làm việc 1:1 chính thức.
            </p>
          </div>
        </div>

        <button
          onClick={() => setBookedMeeting(true)}
          disabled={bookedMeeting}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-2 whitespace-nowrap ${
            bookedMeeting
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30 cursor-pointer'
          }`}
        >
          {bookedMeeting ? (
            <>
              <Check className="w-4 h-4" />
              <span>Đã Đăng Ký Xếp Lịch Bàn 04</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Xác Nhận Đặt Bàn Gặp 1:1</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
