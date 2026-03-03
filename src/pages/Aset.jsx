import React, { useState, useEffect } from 'react';
import { getData, setData, formatRupiah } from '../lib/storage';
import { useToast } from '../components/Toast';
import { Plus, Search, Edit2, Trash2, X, Filter } from 'lucide-react';

export default function Aset() {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'properti',
    nilai: '',
    keterangan: '',
    status: 'draft'
  });

  useEffect(() => {
    setAssets(getData('wd_assets', []));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nilai) {
      addToast('Nama dan Nilai aset wajib diisi', 'error');
      return;
    }

    const newAsset = {
      ...formData,
      id: editingId || Date.now(),
      nilai: Number(formData.nilai.replace(/[^0-9]/g, ''))
    };

    let updatedAssets;
    if (editingId) {
      updatedAssets = assets.map(a => a.id === editingId ? newAsset : a);
      addToast('Aset berhasil diperbarui', 'success');
    } else {
      updatedAssets = [...assets, newAsset];
      addToast('Aset baru berhasil ditambahkan', 'success');
    }

    setAssets(updatedAssets);
    setData('wd_assets', updatedAssets);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
      const updatedAssets = assets.filter(a => a.id !== id);
      setAssets(updatedAssets);
      setData('wd_assets', updatedAssets);
      addToast('Aset berhasil dihapus', 'success');
    }
  };

  const openModal = (asset = null) => {
    if (asset) {
      setEditingId(asset.id);
      setFormData({
        ...asset,
        nilai: asset.nilai.toString()
      });
    } else {
      setEditingId(null);
      setFormData({
        nama: '',
        kategori: 'properti',
        nilai: '',
        keterangan: '',
        status: 'draft'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const filteredAssets = assets.filter(a => {
    const matchFilter = filter === 'semua' || a.kategori === filter;
    const matchSearch = a.nama.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalNilai = filteredAssets.reduce((sum, a) => sum + a.nilai, 0);

  const categories = ['semua', 'properti', 'perbankan', 'investasi', 'kendaraan', 'kripto', 'lainnya'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h2 className="font-serif text-2xl font-bold mb-1">Total Nilai Aset</h2>
          <p className="text-3xl font-bold text-[var(--accent)] font-mono">{formatRupiah(totalNilai)}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">{filteredAssets.length} aset tercatat</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[#1E1810] font-semibold rounded-xl hover:bg-[#D4A843] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Tambah Aset
        </button>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-[var(--text-muted)] mr-2 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                  filter === cat 
                    ? 'bg-[var(--accent)] text-[#1E1810]' 
                    : 'bg-white dark:bg-[var(--bg-sidebar)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]'
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
              placeholder="Cari nama aset..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-gray-100 dark:bg-gray-800 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Aset</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Nilai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset, idx) => (
                  <tr key={asset.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-[var(--text-muted)]">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium">{asset.nama}</td>
                    <td className="px-6 py-4 capitalize">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                        {asset.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">{formatRupiah(asset.nilai)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        asset.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(asset)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">
                    Tidak ada aset yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-1000 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-gray-100 dark:bg-gray-800">
              <h3 className="font-serif text-xl font-bold">{editingId ? 'Edit Aset' : 'Tambah Aset Baru'}</h3>
              <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Aset <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  placeholder="Contoh: Rumah Jl. Merdeka"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kategori</label>
                  <select 
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none capitalize"
                  >
                    {categories.filter(c => c !== 'semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none capitalize"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nilai (Rupiah) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">Rp</span>
                  <input 
                    type="text" 
                    required
                    value={formData.nilai}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({...formData, nilai: val});
                    }}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono"
                    placeholder="0"
                  />
                </div>
                {formData.nilai && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 ml-1">
                    {formatRupiah(formData.nilai)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Keterangan (Opsional)</label>
                <textarea 
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--bg-sidebar)] focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none h-20"
                  placeholder="Catatan tambahan..."
                ></textarea>
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
