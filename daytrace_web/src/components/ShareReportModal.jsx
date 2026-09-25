import React, { useState } from 'react';

export default function ShareReportModal({ isOpen, onClose, title, reportText, screenName }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = reportText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadTxt = () => {
    const filename = `daytrace_${screenName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title} — DayTrace Report</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <pre>${reportText}</pre>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — DayTrace Report`,
          text: reportText,
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-indigo-50 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500 font-medium">Clean paper-ready export & sharable report</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Formatted Text Viewer */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-900 text-cyan-200 font-mono text-xs rounded-xl m-4 border border-slate-800 shadow-inner">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed select-all">{reportText}</pre>
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white grid grid-cols-3 gap-2">
          <button
            onClick={handleCopy}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-indigo-50 hover:bg-indigo-100 text-primary border border-indigo-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'done_all' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Save .txt
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Paper
          </button>
        </div>

        {navigator.share && (
          <div className="px-5 pb-4 bg-white">
            <button
              onClick={handleNativeShare}
              className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              Share to WhatsApp / Telegram / Messages
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
