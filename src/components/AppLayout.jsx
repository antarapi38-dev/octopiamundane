import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Diamond,
  Scale,
  Users,
  Archive,
  Bot,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getData, setData } from '../lib/storage';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState(getData('wd_theme', 'light'));
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setData('wd_theme', theme);
  }, [theme]);

  // Check premium status on mount and location change
  useEffect(() => {
    setIsPremium(localStorage.getItem('wd_isPremium') === 'true');
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setData('wd_isLoggedIn', 'false');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Daftar Aset', path: '/aset', icon: Diamond },
    { name: 'Kalkulator Waris', path: '/kalkulator', icon: Scale },
    { name: 'Ahli Waris', path: '/ahli-waris', icon: Users },
    { name: 'Brankas Dokumen', path: '/brankas', icon: Archive, badge: 2 },
  ];

  const serviceItems = [
    { name: 'AI Advisor', path: '/ai-advisor', icon: Bot },
    { name: 'Draft Wasiat', path: '/wasiat', icon: FileText },
    { name: 'Pembayaran', path: '/pembayaran', icon: CreditCard },
    { name: 'Notifikasi', path: '/notifikasi', icon: Bell, badge: 3 },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Dashboard', sub: 'Ringkasan aset dan status warisan Anda' };
    if (path === '/aset') return { title: 'Daftar Aset Keluarga', sub: 'Kelola dan pantau seluruh aset Anda' };
    if (path === '/kalkulator') return { title: 'Kalkulator Waris', sub: 'Hitung pembagian warisan sesuai hukum yang berlaku' };
    if (path === '/ahli-waris') return { title: 'Data Ahli Waris', sub: 'Kelola data penerima warisan' };
    if (path === '/brankas') return { title: 'Brankas Dokumen', sub: 'Penyimpanan aman terenkripsi AES-256' };
    if (path === '/ai-advisor') return { title: 'AI Waris Advisor', sub: 'Asisten cerdas untuk perencanaan warisan' };
    if (path === '/wasiat') return { title: 'Draft Surat Wasiat', sub: 'Buat draf wasiat otomatis dengan AI' };
    if (path === '/pembayaran') return { title: 'Layanan & Pembayaran', sub: 'Kelola langganan dan transaksi' };
    if (path === '/notifikasi') return { title: 'Pusat Notifikasi', sub: 'Pemberitahuan penting untuk Anda' };
    return { title: 'AsetSantun', sub: '' };
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-1000 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[var(--bg-sidebar)] text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative`}>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            {!isCollapsed && (
              <div className="hidden md:block">
                <h1 className="font-serif text-xl font-bold text-[#D4A843] whitespace-nowrap">AsetSantun</h1>
                <p className="text-xs text-gray-400 whitespace-nowrap">Perencanaan Keluarga</p>
              </div>
            )}
            <div className={`md:hidden ${isCollapsed ? 'hidden' : 'block'}`}>
              <h1 className="font-serif text-xl font-bold text-[#D4A843]">AsetSantun</h1>
              <p className="text-xs text-gray-400">Perencanaan Keluarga</p>
            </div>
          </div>
          <button className="md:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            className="hidden md:flex absolute -right-3 top-8 w-6 h-6 bg-[var(--bg-sidebar)] border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-50"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 hide-scrollbar">
          <div>
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hidden md:block">Menu Utama</p>}
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:hidden">Menu Utama</p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#D4A843]/10 text-[#D4A843] border-l-2 border-[#D4A843]' : 'text-gray-300 hover:bg-white/5 hover:text-white'} relative group`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`text-sm font-medium whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isCollapsed ? 'md:absolute md:top-1 md:right-1 md:px-1 md:py-0 md:text-[8px]' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hidden md:block">Layanan</p>}
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:hidden">Layanan</p>
            <div className="space-y-1">
              {serviceItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#D4A843]/10 text-[#D4A843] border-l-2 border-[#D4A843]' : 'text-gray-300 hover:bg-white/5 hover:text-white'} relative group`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`text-sm font-medium whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isCollapsed ? 'md:absolute md:top-1 md:right-1 md:px-1 md:py-0 md:text-[8px]' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hidden md:block">Akun</p>}
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:hidden">Akun</p>
            <div className="space-y-1">
              <button
                className={`w-full flex items-center ${isCollapsed ? 'md:justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors`}
                title={isCollapsed ? 'Pengaturan' : ''}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Pengaturan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : ''} gap-3 mb-4 p-2 rounded-lg bg-white/5`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8902A] to-[#D4A843] flex items-center justify-center text-white font-bold flex-shrink-0">
              BK
            </div>
            <div className={`flex-1 overflow-hidden ${isCollapsed ? 'md:hidden' : ''}`}>
              <p className="text-sm font-medium text-white truncate">Budi Kartono</p>
              {isPremium ? (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#D4A843]/20 text-[#D4A843] whitespace-nowrap">
                  ✨ Premium
                </span>
              ) : (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-gray-500/20 text-gray-300 whitespace-nowrap">
                  Basic Plan
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors`}
            title={isCollapsed ? 'Keluar' : ''}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-8 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[var(--text-primary)]" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
              <p className="text-xs md:text-sm text-[var(--text-muted)] hidden sm:block">{sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-[var(--text-muted)] transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-[var(--text-muted)] transition-colors" onClick={() => navigate('/notifikasi')}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-card)]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
