import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, formatRupiah } from '../lib/storage';
import { useToast } from '../components/Toast';
import { Shield, Scale, CreditCard, FileText, Box, Clock, CheckCircle2, AlertCircle, ChevronRight, X } from 'lucide-react';

export default function Pembayaran() {
  const [transactions, setTransactions] = useState([]);
  const [heirs, setHeirs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setTransactions(getData('wd_transactions', []));
    setHeirs(getData('wd_heirs', []));
    setIsPremium(localStorage.getItem('wd_isPremium') === 'true');
  }, []);

  const handlePay = (service, amount) => {
    setSelectedService({ name: service, amount });
    setIsModalOpen(true);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const confirmPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: selectedService.name,
          amount: selectedService.amount
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        addToast('Mengarahkan ke halaman pembayaran...', 'success');
        setIsModalOpen(false);
        setIsProcessing(false);
        // Jika URL eksternal Mayar.id, gunakan window.location.href
        // Jika URL internal (dummy checkout), gunakan navigate
        if (data.checkoutUrl.startsWith('http')) {
          window.location.href = data.checkoutUrl;
        } else {
          navigate(data.checkoutUrl);
        }
      } else {
        throw new Error(data.message || 'Gagal membuat link pembayaran');
      }
    } catch (error) {
      addToast(error.message || 'Terjadi kesalahan saat memproses pembayaran', 'error');
      setIsProcessing(false);
    }
  };

  const [notaris, setNotaris] = useState('Notaris Suharto, SH');
  const notarisOptions = [
    { name: 'Notaris Suharto, SH', price: 350000 },
    { name: 'Notaris Indah, SH, MKn', price: 500000 },
    { name: 'Notaris Pratama & Partners', price: 750000 }
  ];

  const [transferHeir, setTransferHeir] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const [propertyValue, setPropertyValue] = useState('');
  const [installment, setInstallment] = useState('3');

  const calculateBPHTB = (value) => {
    const njoptkp = 60000000; // Asumsi NJOPTKP Jakarta
    const val = Number(value.replace(/[^0-9]/g, ''));
    if (val <= njoptkp) return 0;
    return (val - njoptkp) * 0.05;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Status Langganan */}
      {isPremium ? (
        <div className="bg-gradient-to-r from-[#B8902A] to-[#D4A843] rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                  Paket Premium Aktif <CheckCircle2 className="w-5 h-5 text-green-300" />
                </h2>
                <p className="text-white/80 mt-1">Berlaku hingga: 31 Maret 2026</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-3 bg-white text-[#1E1810] font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                Perpanjang
              </button>
              <button className="flex-1 md:flex-none px-6 py-3 bg-black/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-black/30 transition-colors backdrop-blur-sm">
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-5 translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
                <Shield className="w-7 h-7 text-gray-400" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                  Paket Basic
                </h2>
                <p className="text-gray-400 mt-1">Upgrade ke Premium untuk fitur lengkap</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => handlePay('Premium Plan 1 Bulan', 99000)}
                className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-[#B8902A] to-[#D4A843] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                Upgrade Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layanan Pembayaran */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-serif text-2xl font-bold">Layanan & Pembayaran</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Powered by Mayar.id
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Premium */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8902A] to-[#D4A843] flex items-center justify-center text-white shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Berlangganan Premium</h4>
            </div>
            <p className="text-3xl font-bold font-mono mb-4">Rp 99.000<span className="text-sm text-[var(--text-muted)] font-sans font-normal">/bln</span></p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {['Unlimited aset & ahli waris', 'Enkripsi AES-256 Brankas', 'AI Advisor unlimited', 'Export PDF Wasiat & Kalkulasi'].map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePay('Premium Plan 1 Bulan', 99000)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" /> Bayar via Mayar.id
            </button>
          </div>

          {/* Card 2: Notaris */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Konsultasi Notaris</h4>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4 flex-1">Konsultasi legalitas waris, pembuatan akta, dan legalisasi surat wasiat dengan Notaris/PPAT tersumpah.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Pilih Notaris</label>
                <select
                  value={notaris}
                  onChange={(e) => setNotaris(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm"
                >
                  {notarisOptions.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.name} - {formatRupiah(opt.price)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                const selected = notarisOptions.find(n => n.name === notaris);
                handlePay(`Konsultasi: ${selected.name}`, selected.price);
              }}
              className="w-full py-3 bg-[var(--bg-sidebar)] text-white dark:bg-white dark:text-[#1E1810] font-bold rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-sm"
            >
              Booking & Bayar
            </button>
          </div>

          {/* Card 3: Transfer */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-800">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Transfer Ahli Waris</h4>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4 flex-1">Kirim dana warisan langsung ke rekening ahli waris dengan aman menggunakan Payment Link.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Penerima</label>
                <select
                  value={transferHeir}
                  onChange={(e) => setTransferHeir(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm"
                >
                  <option value="">Pilih Ahli Waris...</option>
                  {heirs.map(h => (
                    <option key={h.id} value={h.nama}>{h.nama} ({h.hubungan})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Nominal Transfer</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">Rp</span>
                  <input
                    type="text"
                    value={transferAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    onChange={(e) => setTransferAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!transferHeir || !transferAmount) {
                  addToast('Pilih penerima dan masukkan nominal', 'warning');
                  return;
                }
                handlePay(`Transfer Waris: ${transferHeir}`, Number(transferAmount));
              }}
              className="w-full py-3 bg-[var(--bg-sidebar)] text-white dark:bg-white dark:text-[#1E1810] font-bold rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-sm"
            >
              📤 Transfer via Mayar.id
            </button>
          </div>

          {/* Card 4: Balik Nama */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 flex items-center justify-center shadow-sm border border-orange-100 dark:border-orange-800">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Biaya Balik Nama</h4>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">Hitung estimasi BPHTB Waris (5% di atas NJOPTKP) dan ajukan cicilan pembayaran.</p>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Nilai Properti (NJOP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">Rp</span>
                  <input
                    type="text"
                    value={propertyValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    onChange={(e) => setPropertyValue(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono text-sm"
                    placeholder="0"
                  />
                </div>
                {propertyValue && (
                  <p className="text-xs text-[var(--accent)] mt-1.5 font-medium">
                    Estimasi BPHTB: {formatRupiah(calculateBPHTB(propertyValue))}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Pilihan Cicilan</label>
                <div className="flex gap-2">
                  {['3', '6', '12'].map(m => (
                    <button
                      key={m}
                      onClick={() => setInstallment(m)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${installment === m
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-[#1E1810]'
                        : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]'
                        }`}
                    >
                      {m} Bln
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!propertyValue) {
                  addToast('Masukkan nilai properti terlebih dahulu', 'warning');
                  return;
                }
                handlePay(`Cicilan BPHTB ${installment} Bulan`, calculateBPHTB(propertyValue) / Number(installment));
              }}
              className="w-full py-3 bg-[var(--bg-sidebar)] text-white dark:bg-white dark:text-[#1E1810] font-bold rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-sm"
            >
              Ajukan Cicilan
            </button>
          </div>

          {/* Card 5: PPAT/BPN */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col h-full lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center shadow-sm border border-purple-100 dark:border-purple-800">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Biaya PPAT & BPN</h4>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-6">Tarif resmi pengurusan sertifikat tanah warisan berdasarkan nilai aset properti.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 flex-1">
              {[
                { range: '< Rp 500 Juta', price: 2500000 },
                { range: 'Rp 500Jt - 1M', price: 5000000 },
                { range: '> Rp 1 Miliar', price: 7500000 }
              ].map((tier, i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800 flex flex-col justify-between">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{tier.range}</span>
                  <span className="text-lg font-bold font-mono text-[var(--text-primary)] mb-4">{formatRupiah(tier.price)}</span>
                  <button
                    onClick={() => handlePay(`Biaya PPAT (${tier.range})`, tier.price)}
                    className="w-full py-2 bg-white dark:bg-[var(--bg-sidebar)] text-[var(--text-primary)] text-xs font-bold rounded-lg border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Pilih & Bayar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--text-muted)]" />
          <h3 className="font-serif text-xl font-bold">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-gray-100 dark:bg-gray-800 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Jumlah</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-100 dark:hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-[var(--text-muted)]">{tx.id}</td>
                  <td className="px-6 py-4 font-medium">{tx.layanan}</td>
                  <td className="px-6 py-4 text-[var(--text-muted)]">{tx.tanggal}</td>
                  <td className="px-6 py-4 font-mono font-medium">{formatRupiah(tx.jumlah)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tx.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--text-muted)]">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center border-b border-gray-100 dark:border-[var(--border)]">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">Konfirmasi Pembayaran</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Selesaikan pembayaran Anda dengan aman</p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-black/20">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-[var(--border)]">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Layanan</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white text-right max-w-[200px] truncate">{selectedService.name}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Tagihan</span>
                  <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">{formatRupiah(selectedService.amount)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-pink-600 p-[1px] rounded-xl mb-6">
                <div className="bg-white dark:bg-[var(--bg-card)] rounded-[11px] p-3 flex items-center justify-center gap-2">
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">MAYAR</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Powered by Mayar.id SimplePay</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-white dark:bg-[var(--bg-sidebar)] text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200 dark:border-[var(--border)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Memproses...' : 'Bayar Sekarang'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
