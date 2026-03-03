import React, { useState, useEffect } from 'react';
import { getData } from '../lib/storage';
import { useToast } from '../components/Toast';
import { Shield, Upload, FileText, AlertTriangle, Search, Filter, Lock, Eye, Download } from 'lucide-react';

export default function Brankas() {
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    setDocuments(getData('wd_documents', []));
  }, []);

  const handleUploadClick = () => {
    addToast('Enkripsi dokumen tersedia di versi Premium. Upgrade sekarang untuk menyimpan dokumen dengan aman.', 'warning');
  };

  const handleViewClick = () => {
    addToast('Preview dokumen tersedia di versi Premium.', 'info');
  };

  const filteredDocs = documents.filter(d => {
    const matchFilter = filter === 'semua' || d.tipe.toLowerCase() === filter;
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const hasExpired = documents.some(d => d.status === 'expired');

  const categories = ['semua', 'shm', 'bpkb', 'ktp', 'kk', 'polis', 'kripto', 'stnk'];

  const getDocIconColor = (tipe) => {
    switch(tipe.toLowerCase()) {
      case 'shm': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'bpkb':
      case 'stnk': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'ktp':
      case 'kk': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'polis': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'kripto': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-serif text-2xl font-bold">Brankas Dokumen</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded border border-green-200 dark:border-green-800">
              <Lock className="w-3 h-3" /> AES-256 Protected
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">{documents.length} dokumen tersimpan aman</p>
        </div>
        <button 
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[#1E1810] font-semibold rounded-xl hover:bg-[#D4A843] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Upload className="w-5 h-5" /> Unggah Dokumen
        </button>
      </div>

      {hasExpired && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 dark:text-red-400 text-sm">Perhatian: Ada Dokumen Kedaluwarsa</h4>
            <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">Beberapa dokumen penting Anda telah melewati masa berlaku. Segera perbarui untuk menghindari masalah legalitas.</p>
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-[var(--text-muted)] mr-2 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                  filter === cat 
                    ? 'bg-[var(--accent)] text-[#1E1810]' 
                    : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Cari dokumen..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="group border border-[var(--border)] rounded-xl p-4 hover:shadow-md transition-all hover:border-[var(--accent)]/50 bg-white dark:bg-[var(--bg-sidebar)] relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  doc.status === 'valid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  doc.status === 'expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse' :
                  doc.status === 'expiring' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {doc.status}
                </span>
              </div>
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getDocIconColor(doc.tipe)}`}>
                <FileText className="w-6 h-6" />
              </div>
              
              <h3 className="font-semibold text-sm mb-1 truncate pr-16" title={doc.nama}>{doc.nama}</h3>
              
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-4">
                <span className="uppercase font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{doc.tipe}</span>
                <span>{doc.ukuran}</span>
              </div>
              
              {doc.exp && (
                <div className="text-[10px] text-[var(--text-muted)] mb-4 flex items-center gap-1">
                  <AlertTriangle className={`w-3 h-3 ${doc.status === 'expired' ? 'text-red-500' : doc.status === 'expiring' ? 'text-yellow-500' : ''}`} />
                  Exp: {doc.exp}
                </div>
              )}
              
              <div className="flex gap-2 pt-3 border-t border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={handleViewClick}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat
                </button>
                <button 
                  onClick={handleUploadClick}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-full py-12 text-center border border-[var(--border)] border-dashed rounded-xl">
              <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[var(--text-muted)]">Tidak ada dokumen yang sesuai dengan filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
