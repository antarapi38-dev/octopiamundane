import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, formatRupiah } from '../lib/storage';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Box, 
  Users, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Shield,
  FileText,
  CreditCard,
  Scale,
  Bot
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [heirs, setHeirs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('faraidh');

  useEffect(() => {
    setAssets(getData('wd_assets', []));
    setHeirs(getData('wd_heirs', []));
    setDocuments(getData('wd_documents', []));
  }, []);

  const totalAssets = assets.reduce((sum, item) => sum + item.nilai, 0);
  const totalHeirs = heirs.length;
  const pendingHeirs = heirs.filter(h => h.status === 'pending').length;
  const validDocs = documents.filter(d => d.status === 'valid').length;
  const totalDocs = documents.length;
  const docCompletion = totalDocs > 0 ? Math.round((validDocs / totalDocs) * 100) : 0;
  const missingDocs = totalDocs - validDocs;

  const topAssets = [...assets].sort((a, b) => b.nilai - a.nilai).slice(0, 5);

  const chartData = heirs.map(h => ({
    name: h.nama,
    value: h.nominal,
    color: h.gender === 'laki' ? '#3B82F6' : '#EC4899'
  }));

  const COLORS = ['#D4A843', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-8 pb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#D4A843]/10 flex items-center justify-center text-[#D4A843]">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4" /> +12%
            </span>
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Total Nilai Aset</h3>
          <p className="text-2xl font-bold font-serif">{formatRupiah(totalAssets)}</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Box className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              +3 baru
            </span>
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Total Aset Tercatat</h3>
          <p className="text-2xl font-bold font-serif">{assets.length}</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Users className="w-6 h-6" />
            </div>
            {pendingHeirs > 0 && (
              <span className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                {pendingHeirs} pending
              </span>
            )}
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Ahli Waris</h3>
          <p className="text-2xl font-bold font-serif">{totalHeirs}</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileCheck className="w-6 h-6" />
            </div>
            {missingDocs > 0 && (
              <span className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                {missingDocs} kurang
              </span>
            )}
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Kelengkapan Dokumen</h3>
          <p className="text-2xl font-bold font-serif">{docCompletion}%</p>
        </div>
      </div>

      {/* Grid 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kiri - Aset & Timeline */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold">Aset Teratas</h3>
              <button onClick={() => navigate('/aset')} className="text-sm text-[var(--accent)] hover:underline font-medium">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--text-muted)] uppercase bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Nama Aset</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Nilai</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topAssets.map((asset, idx) => (
                    <tr key={idx} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-4 font-medium">{asset.nama}</td>
                      <td className="px-4 py-4 capitalize">{asset.kategori}</td>
                      <td className="px-4 py-4 font-mono">{formatRupiah(asset.nilai)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          asset.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          asset.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-6">Progress Perencanaan</h3>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Kelengkapan Keseluruhan</span>
                <span className="text-[var(--accent)]">75%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                <div className="bg-[var(--accent)] h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-[var(--bg-card)]"></div>
                <h4 className="font-semibold text-sm">Langkah 1: Pendaftaran & Verifikasi</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1">Selesai pada 12 Jan 2026</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-[var(--bg-card)]"></div>
                <h4 className="font-semibold text-sm">Langkah 2: Pencatatan Aset</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1">18 aset tercatat dan diverifikasi</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-[var(--accent)] border-4 border-white dark:border-[var(--bg-card)] animate-pulse shadow-[0_0_10px_var(--accent)]"></div>
                <h4 className="font-semibold text-sm text-[var(--accent)]">Langkah 3: Penentuan Ahli Waris</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1">Menunggu verifikasi KTP 1 ahli waris</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-[var(--bg-card)]"></div>
                <h4 className="font-semibold text-sm text-gray-400">Langkah 4: Finalisasi Wasiat</h4>
                <p className="text-xs text-gray-500 mt-1">Menunggu langkah 3 selesai</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-[var(--bg-card)]"></div>
                <h4 className="font-semibold text-sm text-gray-400">Langkah 5: Legalisasi Notaris</h4>
                <p className="text-xs text-gray-500 mt-1">Belum dimulai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan - Distribusi & AI */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold">Distribusi Waris</h3>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {['faraidh', 'perdata', 'wasiat'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                      activeTab === tab 
                        ? 'bg-white dark:bg-[var(--bg-sidebar)] text-[var(--accent)] shadow-sm' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 mb-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatRupiah(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-[var(--text-muted)]">Total</span>
                <span className="text-sm font-bold font-serif">{formatRupiah(totalAssets)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {heirs.slice(0, 4).map((heir, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <div>
                      <p className="text-sm font-medium">{heir.nama}</p>
                      <p className="text-xs text-[var(--text-muted)]">{heir.hubungan} • {heir.bagian}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium">{formatRupiah(heir.nominal)}</p>
                    <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 ml-auto">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ width: `${(heir.nominal / totalAssets) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/kalkulator')} className="w-full mt-6 py-2.5 text-sm font-medium text-[var(--accent)] border border-[var(--accent)] rounded-xl hover:bg-[var(--accent)] hover:text-white transition-colors">
              Lihat Detail Kalkulasi
            </button>
          </div>

          <div className="bg-[var(--bg-sidebar)] p-6 rounded-2xl border border-[var(--border)] shadow-sm text-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--accent)]">AI Advisor</h3>
                <p className="text-xs text-gray-400">Siap membantu Anda</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-200">
                Halo Pak Budi! Ada 2 hal yang perlu diperhatikan: dokumen kripto belum lengkap & polis asuransi expired.
              </div>
              <div className="bg-[var(--accent)]/20 rounded-2xl rounded-tr-sm p-3 text-sm text-white ml-8 border border-[var(--accent)]/30">
                Bagaimana cara pembagian kripto menurut Islam?
              </div>
              <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-200">
                Aset kripto diperlakukan sebagai māl (harta) dalam Faraidh...
              </div>
            </div>

            <button onClick={() => navigate('/ai-advisor')} className="w-full py-3 bg-[var(--accent)] text-[#1E1810] rounded-xl font-semibold hover:bg-[#D4A843] transition-colors flex items-center justify-center gap-2">
              Lanjutkan Konsultasi <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mayar.id Section */}
      <div className="bg-gradient-to-br from-blue-50 to-pink-50 dark:from-blue-900/10 dark:to-pink-900/10 p-6 md:p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600 dark:from-blue-400 dark:to-pink-400">
                Layanan Terintegrasi Mayar.id
              </h2>
              <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Aktif
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">Pembayaran aman, cepat, dan terpercaya untuk semua kebutuhan legalitas waris Anda.</p>
          </div>
          <button onClick={() => navigate('/pembayaran')} className="px-5 py-2.5 bg-white dark:bg-[var(--bg-card)] text-sm font-semibold rounded-xl shadow-sm border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
            Kelola Pembayaran
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Konsultasi Notaris', price: 'Mulai Rp 350.000', icon: Scale, btn: 'Bayar via Mayar' },
            { title: 'Premium Plan', price: 'Rp 99.000/bln', icon: Shield, btn: 'Sudah Aktif ✓', active: true },
            { title: 'Transfer Ahli Waris', price: 'via Payment Link', icon: CreditCard, btn: 'Kirim Dana' },
            { title: 'Biaya Balik Nama', price: 'Cicilan 3-12 bulan', icon: FileText, btn: 'Ajukan' },
            { title: 'Biaya PPAT/BPN', price: 'Estimasi otomatis', icon: Box, btn: 'Hitung' },
            { title: 'Riwayat Transaksi', price: '12 transaksi', icon: Clock, btn: 'Lihat' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.active ? 'bg-gradient-to-br from-[#B8902A] to-[#D4A843] text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.price}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/pembayaran')}
                className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10'
                }`}
              >
                {item.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold">Brankas Dokumen</h3>
            <button onClick={() => navigate('/brankas')} className="text-[var(--accent)] hover:underline text-sm font-medium">Lihat</button>
          </div>
          <div className="space-y-3">
            {documents.slice(0, 4).map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[150px]">{doc.nama}</p>
                    <p className="text-xs text-[var(--text-muted)]">{doc.tipe}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  doc.status === 'valid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  doc.status === 'expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold">Kalkulator Preview</h3>
            <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Faraidh</span>
          </div>
          <div className="space-y-3">
            {heirs.slice(0, 4).map((heir, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-sm">{heir.nama} <span className="text-[var(--text-muted)] text-xs">({heir.bagian})</span></span>
                <span className="font-mono text-sm font-medium">{formatRupiah(heir.nominal)}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/kalkulator')} className="w-full mt-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            Hitung Ulang
          </button>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <h3 className="font-serif text-lg font-bold mb-4">Pengingat Penting</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-400">Polis Asuransi Kedaluwarsa</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">Perbarui dokumen sebelum 5 Mar 2026</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30 flex gap-3">
              <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Verifikasi Ahli Waris</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-0.5">KTP Ahmad Kartono masih pending</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30 flex gap-3">
              <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">Saran AI Advisor</p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">Lengkapi dokumentasi aset kripto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
