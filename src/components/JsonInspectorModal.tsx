import React, { useState } from 'react';
import { EDUBOT_GLOBAL_VENTURES_RESULT } from '../data/presetData';
import { Code, Copy, Check, Download, Sparkles } from 'lucide-react';

export const JsonInspectorModal: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const jsonObject = {
    matching_score: EDUBOT_GLOBAL_VENTURES_RESULT.matching_score,
    reason: EDUBOT_GLOBAL_VENTURES_RESULT.reason,
    ice_breakers: EDUBOT_GLOBAL_VENTURES_RESULT.ice_breakers,
  };

  const jsonString = JSON.stringify(jsonObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'davas_edubot_global_ventures_match.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Kết Quả Đánh Giá Chuẩn Định Dạng JSON</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đúng 3 trường theo yêu cầu bắt buộc: matching_score, reason (&lt; 50 từ tiếng Việt), ice_breakers (3 câu hỏi).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Tải về .json</span>
          </button>
        </div>
      </div>

      {/* Code Box */}
      <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs font-mono text-slate-400">
          <span>payload_response.json</span>
          <span className="text-emerald-400 font-semibold">Valid JSON • 3 Required Fields</span>
        </div>

        <pre className="text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto p-4 bg-slate-900 rounded-xl border border-slate-800">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
