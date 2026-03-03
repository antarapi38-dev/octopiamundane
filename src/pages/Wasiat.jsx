import React, { useState, useEffect } from 'react';
import { getData, setData, formatRupiah } from '../lib/storage';
import { useToast } from '../components/Toast';
import { Bot, Save, FileDown, AlertTriangle, PenTool, CheckCircle2 } from 'lucide-react';

export default function Wasiat() {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const savedContent = getData('wd_wasiat_draft', '');
    if (savedContent) {
      setContent(savedContent);
      setLastSaved(new Date().toLocaleString('id-ID'));
    }
  }, []);

  const generateTemplate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const assets = getData('wd_assets', []);
      const heirs = getData('wd_heirs', []);
      const totalAssets = assets.reduce((sum, item) => sum + item.nilai, 0);

      let heirsText = '';
      heirs.forEach((h, idx) => {
        heirsText += `${idx + 1}. ${h.nama} (${h.hubungan})\n   Bagian: ${h.bagian} = ${formatRupiah(h.nominal || 0)}\n\n`;
      });

      const template = `SURAT WASIAT

Yang bertanda tangan di bawah ini:
Nama    : Budi Kartono
Alamat  : Jl. Merdeka No. 12, Jakarta Selatan

Dengan ini menyatakan bahwa seluruh harta warisan saya senilai ${formatRupiah(totalAssets)} dibagikan kepada ahli waris sebagai berikut:

${heirsText}Pembagian ini berdasarkan hukum waris Islam (Faraidh) sesuai Q.S. An-Nisa: 11-12.

Jakarta, ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}

(Budi Kartono)`;

      setContent(template);
      setIsGenerating(false);
      addToast('Draft wasiat berhasil di-generate oleh AI', 'success');
    }, 1500);
  };

  const handleSave = () => {
    if (!content.trim()) {
      addToast('Draft wasiat masih kosong', 'warning');
      return;
    }
    setData('wd_wasiat_draft', content);
    setLastSaved(new Date().toLocaleString('id-ID'));
    addToast('Draft wasiat berhasil disimpan', 'success');
  };

  const handleExport = () => {
    addToast('Fitur Export PDF segera hadir di versi Premium', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-serif text-2xl font-bold">Draft Surat Wasiat</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded border border-yellow-200 dark:border-yellow-800">
              <PenTool className="w-3 h-3" /> Draft
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">Buat draf wasiat otomatis berdasarkan data aset dan ahli waris Anda.</p>
        </div>
        <button 
          onClick={generateTemplate}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all shadow-sm w-full sm:w-auto justify-center ${
            isGenerating 
              ? 'bg-gray-200 dark:bg-gray-700 text-[var(--text-muted)] cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#B8902A] to-[#D4A843] text-white hover:from-[#D4A843] hover:to-[#e5b954] shadow-[#D4A843]/20'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin"></span>
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bot className="w-5 h-5" /> Generate dengan AI
            </span>
          )}
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 flex items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-2">
        <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 text-sm">Informasi Legalitas</h4>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">Wasiat yang sah secara hukum perlu dilegalisasi oleh Notaris/PPAT. Draf ini hanya sebagai referensi awal.</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          {lastSaved && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Terakhir disimpan: {lastSaved}
            </span>
          )}
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Klik 'Generate dengan AI' untuk membuat draf otomatis, atau ketik manual di sini..."
          className="flex-1 w-full p-6 bg-transparent text-[var(--text-primary)] font-mono text-sm leading-relaxed resize-none outline-none focus:ring-0"
          spellCheck="false"
        />

        <div className="p-4 border-t border-[var(--border)] bg-gray-100 dark:bg-gray-800 flex gap-3 justify-end">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[var(--bg-sidebar)] text-[var(--text-primary)] font-medium text-sm rounded-lg border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[#1E1810] font-medium text-sm rounded-lg hover:bg-[#D4A843] transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Simpan Draft
          </button>
        </div>
      </div>
    </div>
  );
}
