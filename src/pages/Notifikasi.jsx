import React, { useState, useEffect } from 'react';
import { getData, setData } from '../lib/storage';
import { useToast } from '../components/Toast';
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';

export default function Notifikasi() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('semua');
  const { addToast } = useToast();

  useEffect(() => {
    setNotifications(getData('wd_notifications', []));
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, dibaca: true } : n);
    setNotifications(updated);
    setData('wd_notifications', updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, dibaca: true }));
    setNotifications(updated);
    setData('wd_notifications', updated);
    addToast('Semua notifikasi ditandai dibaca', 'success');
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'semua') return true;
    if (filter === 'belum_dibaca') return !n.dibaca;
    if (filter === 'mendesak') return n.tipe === 'danger' || n.tipe === 'warning';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  const getIcon = (tipe) => {
    switch(tipe) {
      case 'danger': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (tipe, dibaca) => {
    if (dibaca) return 'bg-transparent border-[var(--border)]';
    switch(tipe) {
      case 'danger': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30';
      case 'success': return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30';
      default: return 'bg-gray-100 dark:bg-gray-800 border-[var(--border)]';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-serif text-2xl font-bold">Pusat Notifikasi</h2>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">Pemberitahuan penting terkait akun dan aset Anda.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors shadow-sm w-full sm:w-auto justify-center ${
            unreadCount === 0 
              ? 'bg-gray-100 dark:bg-gray-800 text-[var(--text-muted)] cursor-not-allowed' 
              : 'bg-white dark:bg-[var(--bg-sidebar)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <Check className="w-4 h-4" /> Tandai Semua Dibaca
        </button>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-gray-100 dark:bg-gray-800 flex gap-2 overflow-x-auto hide-scrollbar">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'belum_dibaca', label: 'Belum Dibaca' },
            { id: 'mendesak', label: 'Mendesak' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                filter === tab.id 
                  ? 'bg-[var(--accent)] text-[#1E1810] shadow-sm' 
                  : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[var(--border)]">
          {filteredNotifs.map(notif => (
            <div 
              key={notif.id} 
              onClick={() => !notif.dibaca && markAsRead(notif.id)}
              className={`p-5 flex gap-4 transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 border-l-4 ${notif.dibaca ? 'border-transparent' : 'border-[var(--accent)]'} ${getBgColor(notif.tipe, notif.dibaca)}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(notif.tipe)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h4 className={`text-sm font-bold ${notif.dibaca ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                    {notif.judul}
                  </h4>
                  {!notif.dibaca && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0 mt-1.5"></span>
                  )}
                </div>
                <p className={`text-sm ${notif.dibaca ? 'text-[var(--text-muted)]/70' : 'text-[var(--text-muted)]'}`}>
                  {notif.pesan}
                </p>
                <p className="text-xs text-[var(--text-muted)]/50 mt-2 font-mono">
                  Beberapa saat yang lalu
                </p>
              </div>
            </div>
          ))}

          {filteredNotifs.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-30" />
              <p className="text-sm text-[var(--text-muted)]">Tidak ada notifikasi yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
