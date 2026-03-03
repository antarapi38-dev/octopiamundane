import React, { useState, useEffect } from 'react';
import { getData, setData, formatRupiah } from '../lib/storage';
import { useToast } from '../components/Toast';
import { Plus, Edit2, Trash2, X, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AhliWaris() {
  const [heirs, setHeirs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    nama: '',
    hubungan: 'Istri',
    gender: 'perempuan',
    nik: '',
    status: 'pending',
    bagian: 'Belum dihitung',
    nominal: 0
  });

  useEffect(() => {
    setHeirs(getData('wd_heirs', []));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nama) {
      addToast('Nama ahli waris wajib diisi', 'error');
      return;
    }

    const newHeir = {
      ...formData,
      id: editingId || Date.now()
    };

    let updatedHeirs;
    if (editingId) {
      updatedHeirs = heirs.map(h => h.id === editingId ? newHeir : h);
      addToast('Data ahli waris berhasil diperbarui', 'success');
    } else {
      updatedHeirs = [...heirs, newHeir];
      addToast('Ahli waris baru berhasil ditambahkan', 'success');
    }

    setHeirs(updatedHeirs);
    setData('wd_heirs', updatedHeirs);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ahli waris ini?')) {
      const updatedHeirs = heirs.filter(h => h.id !== id);
      setHeirs(updatedHeirs);
      setData('wd_heirs', updatedHeirs);
      addToast('Data ahli waris berhasil dihapus', 'success');
    }
  };

  const openModal = (heir = null) => {
    if (heir) {
      setEditingId(heir.id);
      setFormData(heir);
    } else {
      setEditingId(null);
      setFormData({
        nama: '',
        hubungan: 'Istri',
        gender: 'perempuan',
        nik: '',
        status: 'pending',
        bagian: 'Belum dihitung',
        nominal: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const hubunganOptions = [
    'Istri', 'Suami', 'Anak Laki-laki', 'Anak Perempuan', 
    'Ibu Kandung', 'Ayah Kandung', 'Saudara Laki-laki', 'Saudara Perempuan'
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (idx) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500'
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h2 className="font-serif text-2xl font-bold mb-1">Data Ahli Waris</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">{heirs.length} orang tercatat dalam sistem</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[#1E1810] font-semibold rounded-xl hover:bg-[#D4A843] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Tambah Ahli Waris
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {heirs.map((heir, idx) => (
          <div key={heir.id} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(heir)} className="p-1.5 bg-white dark:bg-[var(--bg-sidebar)] text-blue-600 rounded-lg border border-[var(--border)] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(heir.id)} className="p-1.5 bg-white dark:bg-[var(--bg-sidebar)] text-red-600 rounded-lg border border-[var(--border)] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarColor(idx)} flex items-center justify-center text-white font-bold text-xl shadow-inner`}>
                  {getInitials(heir.nama)}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{heir.nama}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-[var(--text-muted)]">
                      {heir.hubungan}
                    </span>
                    {heir.status === 'verified' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-[var(--border)]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Gender</span>
                  <span className="text-sm font-medium capitalize">{heir.gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Bagian Waris</span>
                  <span className="text-sm font-medium bg-white dark:bg-[var(--bg-sidebar)] px-2 py-0.5 rounded border border-[var(--border)]">{heir.bagian}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Estimasi Nominal</span>
                  <span className="text-sm font-bold font-mono text-[var(--accent)]">{formatRupiah(heir.nominal)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {heirs.length === 0 && (
          <div className="col-span-full py-12 text-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] border-dashed">
            <User className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
            <h3 className="font-serif text-xl font-bold mb-1">Belum ada data</h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">Tambahkan data ahli waris untuk mulai menghitung pembagian.</p>
            <button 
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-1000 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-gray-100 dark:bg-gray-800">
              <h3 className="font-serif text-xl font-bold">{editingId ? 'Edit Data Ahli Waris' : 'Tambah Ahli Waris'}</h3>
              <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  placeholder="Contoh: Ahmad Kartono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Hubungan Keluarga</label>
                  <select 
                    value={formData.hubungan}
                    onChange={(e) => setFormData({...formData, hubungan: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  >
                    {hubunganOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  >
                    <option value="laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">NIK (Opsional)</label>
                  <input 
                    type="text" 
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value.replace(/[^0-9]/g, '')})}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                    placeholder="16 digit NIK"
                    maxLength="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status Verifikasi</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[var(--accent)] text-[#1E1810] font-semibold rounded-xl hover:bg-[#D4A843] transition-colors shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
