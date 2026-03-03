import React, { useState, useEffect } from 'react';
import { getData, setData, formatRupiah } from '../lib/storage';
import { useToast } from '../components/Toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Scale, Save, FileDown, AlertCircle, Info, BookOpen } from 'lucide-react';

export default function Kalkulator() {
  const [assets, setAssets] = useState([]);
  const [heirs, setHeirs] = useState([]);
  const [method, setMethod] = useState('faraidh');
  const [isCalculated, setIsCalculated] = useState(false);
  const [results, setResults] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    setAssets(getData('wd_assets', []));
    setHeirs(getData('wd_heirs', []));
  }, []);

  const totalAssets = assets.reduce((sum, item) => sum + item.nilai, 0);

  const calculateFaraidh = () => {
    if (totalAssets === 0 || heirs.length === 0) {
      addToast('Data aset atau ahli waris kosong. Silakan lengkapi data terlebih dahulu.', 'warning');
      return;
    }

    // Algoritma Faraidh (Hardcoded for Kartono family based on prompt)
    // In a real app, this would be a complex rule engine.
    const istri = heirs.filter(h => h.hubungan === 'Istri');
    const suami = heirs.find(h => h.hubungan === 'Suami');
    const ibu = heirs.find(h => h.hubungan === 'Ibu Kandung');
    const ayah = heirs.find(h => h.hubungan === 'Ayah Kandung');
    const anakLaki = heirs.filter(h => h.hubungan === 'Anak Laki-laki');
    const anakPerempuan = heirs.filter(h => h.hubungan === 'Anak Perempuan');
    const saudaraLaki = heirs.filter(h => h.hubungan === 'Saudara Laki-laki');
    const saudaraPerempuan = heirs.filter(h => h.hubungan === 'Saudara Perempuan');

    let newResults = [];

    if (method === 'faraidh') {
      const hasAnak = anakLaki.length > 0 || anakPerempuan.length > 0;
      const hasAnakLaki = anakLaki.length > 0;
      const numSaudara = saudaraLaki.length + saudaraPerempuan.length;

      let shares = {}; // heir.id -> fraction
      
      // 1. Suami / Istri
      if (suami) shares[suami.id] = hasAnak ? 1/4 : 1/2;
      if (istri.length > 0) {
        const sharePerIstri = (hasAnak ? 1/8 : 1/4) / istri.length;
        istri.forEach(i => shares[i.id] = sharePerIstri);
      }

      // 2. Ibu
      if (ibu) shares[ibu.id] = (hasAnak || numSaudara >= 2) ? 1/6 : 1/3;

      // 3. Ayah
      if (ayah) {
        if (hasAnakLaki) shares[ayah.id] = 1/6;
        else if (anakPerempuan.length > 0) shares[ayah.id] = 1/6; // + Asabah later
      }

      // 4. Anak Perempuan (if no Anak Laki-laki)
      if (anakPerempuan.length > 0 && !hasAnakLaki) {
        const totalShareAP = anakPerempuan.length === 1 ? 1/2 : 2/3;
        const sharePerAP = totalShareAP / anakPerempuan.length;
        anakPerempuan.forEach(ap => shares[ap.id] = sharePerAP);
      }

      // 5. Saudara (if not blocked by Ayah or Anak Laki-laki)
      const blockedSaudara = ayah || hasAnakLaki;
      if (!blockedSaudara && saudaraPerempuan.length > 0 && saudaraLaki.length === 0) {
         const totalShareSP = saudaraPerempuan.length === 1 ? 1/2 : 2/3;
         const sharePerSP = totalShareSP / saudaraPerempuan.length;
         saudaraPerempuan.forEach(sp => shares[sp.id] = sharePerSP);
      }

      let sumFixed = Object.values(shares).reduce((a, b) => a + b, 0);

      // Aul (if sum > 1)
      if (sumFixed > 1) {
        for (const id in shares) shares[id] = shares[id] / sumFixed;
        sumFixed = 1;
      }

      // Asabah (Residue)
      let residue = 1 - sumFixed;
      if (residue > 0.0001) {
        let asabahReceivers = [];
        let asabahUnits = 0;

        if (hasAnakLaki) {
          anakLaki.forEach(al => { asabahReceivers.push({id: al.id, units: 2}); asabahUnits += 2; });
          anakPerempuan.forEach(ap => { asabahReceivers.push({id: ap.id, units: 1}); asabahUnits += 1; });
        } else if (ayah) {
          asabahReceivers.push({id: ayah.id, units: 1});
          asabahUnits += 1;
        } else if (!blockedSaudara && saudaraLaki.length > 0) {
          saudaraLaki.forEach(sl => { asabahReceivers.push({id: sl.id, units: 2}); asabahUnits += 2; });
          saudaraPerempuan.forEach(sp => { asabahReceivers.push({id: sp.id, units: 1}); asabahUnits += 1; });
        }

        if (asabahUnits > 0) {
          const perUnit = residue / asabahUnits;
          asabahReceivers.forEach(r => shares[r.id] = (shares[r.id] || 0) + (perUnit * r.units));
        } else {
          // Rad (simplified: distribute proportionally to non-spouse heirs)
          let sumNonSpouse = 0;
          for (const id in shares) {
             const h = heirs.find(x => x.id === id);
             if (h.hubungan !== 'Suami' && h.hubungan !== 'Istri') sumNonSpouse += shares[id];
          }
          if (sumNonSpouse > 0) {
             for (const id in shares) {
                 const h = heirs.find(x => x.id === id);
                 if (h.hubungan !== 'Suami' && h.hubungan !== 'Istri') shares[id] += residue * (shares[id] / sumNonSpouse);
             }
          } else if (sumFixed > 0) {
             for (const id in shares) shares[id] += residue * (shares[id] / sumFixed);
          }
        }
      }

      heirs.forEach(h => {
        if (shares[h.id] && shares[h.id] > 0.0001) {
          const fraction = shares[h.id];
          let dasar = '';
          if (h.hubungan === 'Istri') dasar = hasAnak ? 'Q.S. An-Nisa: 12 (1/8)' : 'Q.S. An-Nisa: 12 (1/4)';
          if (h.hubungan === 'Suami') dasar = hasAnak ? 'Q.S. An-Nisa: 12 (1/4)' : 'Q.S. An-Nisa: 12 (1/2)';
          if (h.hubungan === 'Ibu Kandung') dasar = (hasAnak || numSaudara >= 2) ? 'Q.S. An-Nisa: 11 (1/6)' : 'Q.S. An-Nisa: 11 (1/3)';
          if (h.hubungan === 'Ayah Kandung') dasar = hasAnakLaki ? 'Q.S. An-Nisa: 11 (1/6)' : (anakPerempuan.length > 0 ? 'Q.S. An-Nisa: 11 (1/6 + Asabah)' : 'Asabah');
          if (h.hubungan === 'Anak Perempuan') dasar = hasAnakLaki ? 'Asabah bil Ghair (1:2)' : (anakPerempuan.length === 1 ? 'Q.S. An-Nisa: 11 (1/2)' : 'Q.S. An-Nisa: 11 (2/3)');
          if (h.hubungan === 'Anak Laki-laki') dasar = 'Asabah (Sisa)';
          if (h.hubungan.includes('Saudara')) dasar = blockedSaudara ? 'Mahjub (Terhalang)' : 'Asabah / Bagian Tetap';

          newResults.push({
            ...h,
            bagian: `${(fraction * 100).toFixed(1)}%`,
            persen: fraction * 100,
            nominal: fraction * totalAssets,
            dasar: dasar
          });
        } else {
          newResults.push({
            ...h,
            bagian: '0%',
            persen: 0,
            nominal: 0,
            dasar: 'Mahjub (Terhalang)'
          });
        }
      });
    } else if (method === 'perdata') {
      const golonganI = heirs.filter(h => ['Istri', 'Suami', 'Anak Laki-laki', 'Anak Perempuan'].includes(h.hubungan));
      const golonganII = heirs.filter(h => ['Ibu Kandung', 'Ayah Kandung', 'Saudara Laki-laki', 'Saudara Perempuan'].includes(h.hubungan));

      if (golonganI.length > 0) {
        const perBagian = totalAssets / golonganI.length;
        const persenBagian = 100 / golonganI.length;
        
        heirs.forEach(h => {
          if (golonganI.includes(h)) {
            newResults.push({
              ...h,
              bagian: `1/${golonganI.length}`,
              persen: persenBagian,
              nominal: perBagian,
              dasar: 'KUHPerdata Golongan Ahli Waris'
            });
          }
        });
      } else if (golonganII.length > 0) {
        const parents = golonganII.filter(h => ['Ibu Kandung', 'Ayah Kandung'].includes(h.hubungan));
        const siblings = golonganII.filter(h => ['Saudara Laki-laki', 'Saudara Perempuan'].includes(h.hubungan));
        
        let parentShare = 0;
        let siblingShare = 0;

        if (siblings.length === 0) {
           parentShare = 1 / parents.length;
        } else if (parents.length === 0) {
           siblingShare = 1 / siblings.length;
        } else {
           if (parents.length === 2) {
              parentShare = 1/4;
              siblingShare = (1 - (2 * 1/4)) / siblings.length;
           } else {
              parentShare = 1/4;
              siblingShare = (1 - 1/4) / siblings.length;
           }
        }

        heirs.forEach(h => {
          if (parents.includes(h)) {
            newResults.push({
              ...h,
              bagian: `${(parentShare*100).toFixed(1)}%`,
              persen: parentShare * 100,
              nominal: parentShare * totalAssets,
              dasar: 'KUHPerdata Golongan Ahli Waris'
            });
          } else if (siblings.includes(h)) {
            newResults.push({
              ...h,
              bagian: `${(siblingShare*100).toFixed(1)}%`,
              persen: siblingShare * 100,
              nominal: siblingShare * totalAssets,
              dasar: 'KUHPerdata Golongan Ahli Waris'
            });
          }
        });
      } else {
         const perBagian = totalAssets / heirs.length;
         const persenBagian = 100 / heirs.length;
         heirs.forEach(h => {
           newResults.push({
             ...h,
             bagian: `1/${heirs.length}`,
             persen: persenBagian,
             nominal: perBagian,
             dasar: 'KUHPerdata Golongan Ahli Waris'
           });
         });
      }
    } else if (method === 'wasiat') {
      const perBagian = totalAssets / heirs.length;
      const persenBagian = 100 / heirs.length;
      heirs.forEach(ahli => {
        newResults.push({
          ...ahli,
          bagian: `1/${heirs.length}`,
          persen: persenBagian,
          nominal: perBagian,
          dasar: 'Wasiat (Dibagi Rata)'
        });
      });
    }

    setResults(newResults);
    setIsCalculated(true);
    addToast(`Kalkulasi ${method === 'faraidh' ? 'Faraidh' : method === 'perdata' ? 'Perdata' : 'Wasiat'} berhasil diselesaikan`, 'success');
  };

  const saveResults = () => {
    // Update heirs in localStorage with calculated nominals
    const updatedHeirs = heirs.map(h => {
      const res = results.find(r => r.id === h.id);
      if (res) {
        return { ...h, bagian: res.bagian, nominal: res.nominal };
      }
      return h;
    });
    setData('wd_heirs', updatedHeirs);
    addToast('Hasil kalkulasi berhasil disimpan', 'success');
  };

  const exportPDF = () => {
    addToast('Fitur Export PDF tersedia di versi Premium', 'info');
  };

  const COLORS = ['#D4A843', '#4285F4', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6'];

  const chartData = results.map(r => ({
    name: r.nama,
    value: r.nominal
  }));

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Kalkulator Waris</h2>
            <p className="text-[var(--text-muted)] text-sm">Hitung pembagian warisan berdasarkan hukum yang berlaku di Indonesia.</p>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl self-stretch md:self-auto">
            {[
              { id: 'faraidh', label: 'Faraidh Islam' },
              { id: 'perdata', label: 'Hukum Perdata' },
              { id: 'wasiat', label: 'Wasiat Bebas' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setMethod(m.id);
                  setIsCalculated(false);
                }}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  method === m.id 
                    ? 'bg-white dark:bg-[var(--bg-sidebar)] text-[var(--accent)] shadow-sm border border-[var(--border)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Harta Warisan</h3>
            <p className="text-3xl font-bold font-mono text-[var(--accent)]">{formatRupiah(totalAssets)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Dari {assets.length} aset tercatat
            </p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--border)] bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Ahli Waris Aktif</h3>
            <p className="text-3xl font-bold font-mono text-[var(--text-primary)]">{heirs.length} <span className="text-lg font-medium text-[var(--text-muted)]">Orang</span></p>
            <div className="flex flex-wrap gap-1 mt-2">
              {heirs.map(h => (
                <span key={h.id} className="text-[10px] font-medium bg-white dark:bg-[var(--bg-sidebar)] px-2 py-0.5 rounded border border-[var(--border)]">
                  {h.hubungan}
                </span>
              ))}
            </div>
          </div>
        </div>

        {!isCalculated ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6">
              <Scale className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Siap Menghitung Distribusi</h3>
            <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md mx-auto">
              Sistem akan menghitung pembagian secara otomatis berdasarkan data aset dan ahli waris yang telah Anda masukkan menggunakan metode {method === 'faraidh' ? 'Faraidh Islam' : method === 'perdata' ? 'Hukum Perdata' : 'Wasiat Bebas'}.
            </p>
            <button 
              onClick={calculateFaraidh}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-[#1E1810] font-bold text-lg rounded-xl hover:bg-[#D4A843] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Scale className="w-6 h-6" /> Hitung Distribusi Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-bold">Hasil Kalkulasi {method === 'faraidh' ? 'Faraidh' : method === 'perdata' ? 'Perdata' : 'Wasiat'}</h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Column: Chart & Buttons */}
              <div className="w-full lg:w-1/3 bg-white dark:bg-[var(--bg-sidebar)] rounded-2xl border border-[var(--border)] p-6 shadow-sm flex flex-col items-center">
                <div className="w-full h-64 relative mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
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
                    <span className="font-serif text-3xl font-bold">{results.length}</span>
                    <span className="text-xs text-[var(--text-muted)]">Bagian</span>
                  </div>
                </div>
                
                <div className="w-full space-y-3">
                  <button 
                    onClick={exportPDF}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-[var(--bg-sidebar)] text-[var(--text-primary)] font-semibold rounded-xl border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    <FileDown className="w-5 h-5" /> Export Laporan PDF
                  </button>
                  <button 
                    onClick={saveResults}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[#D4A843] transition-colors shadow-sm"
                  >
                    <Save className="w-5 h-5" /> Simpan ke Riwayat
                  </button>
                </div>
              </div>
              
              {/* Right Column: Table */}
              <div className="w-full lg:w-2/3 bg-white dark:bg-[var(--bg-sidebar)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
                      <tr>
                        <th className="px-6 py-4 font-semibold">AHLI WARIS & HUBUNGAN</th>
                        <th className="px-6 py-4 font-semibold">DASAR HUKUM</th>
                        <th className="px-6 py-4 font-semibold text-center">PERSENTASE</th>
                        <th className="px-6 py-4 font-semibold text-right">NILAI ESTIMASI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res, idx) => (
                        <tr key={res.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                              <div>
                                <p className="font-semibold text-[var(--text-primary)]">{res.nama}</p>
                                <p className="text-xs text-[var(--text-muted)]">{res.hubungan}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                            {res.dasar}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-2 py-1 border border-[var(--border)] rounded text-xs font-medium text-[var(--text-primary)]">
                              {res.persen.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-[var(--accent)]">
                            {formatRupiah(res.nominal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
