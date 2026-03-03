import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setData } from '../lib/storage';
import { Shield, Scale, Bot } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('aset@santun.id');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = (e) => {
    e.preventDefault();
    setData('wd_isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] dark:bg-[#0D1117] text-[#1E1810] dark:text-[#E8E0D0] transition-colors duration-200">
      {/* Left Column - Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#1E1810] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1810] to-[#2A2216] opacity-90 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#B8902A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-[#D4A843] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img src="/logo.png" alt="AsetSantun Logo" className="w-12 h-12 object-contain" />
            <h1 className="font-serif text-3xl font-bold text-[#D4A843]">AsetSantun</h1>
          </div>

          <h2 className="font-serif text-5xl font-bold leading-tight mb-6">
            Rencanakan Warisan,<br />
            <span className="text-[#D4A843]">Jaga Keharmonisan Keluarga</span>
          </h2>

          <p className="text-lg text-gray-400 mb-12 max-w-md">
            Platform terpercaya untuk mencatat aset, menghitung pembagian waris, dan mengamankan dokumen penting keluarga Anda.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4A843]">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Kalkulator Faraidh Otomatis</h3>
                <p className="text-sm text-gray-400">Hitung pembagian waris sesuai syariat Islam</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4A843]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Brankas Dokumen Terenkripsi</h3>
                <p className="text-sm text-gray-400">Simpan dokumen penting dengan aman</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4A843]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Waris Advisor</h3>
                <p className="text-sm text-gray-400">Konsultasi cerdas seputar hukum waris</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          &copy; 2026 AsetSantun Indonesia. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <img src="/logo.png" alt="AsetSantun Logo" className="w-12 h-12 object-contain" />
            <h1 className="font-serif text-3xl font-bold text-[#B8902A] dark:text-[#D4A843]">AsetSantun</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-serif text-3xl font-bold mb-2">Selamat Datang Kembali</h2>
            <p className="text-[#9A8E80] dark:text-[#8A8070]">Masuk ke akun AsetSantun Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFC8] dark:border-[rgba(201,168,76,0.15)] bg-white dark:bg-[#131920] focus:ring-2 focus:ring-[#B8902A] dark:focus:ring-[#D4A843] focus:border-transparent outline-none transition-all"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFC8] dark:border-[rgba(201,168,76,0.15)] bg-white dark:bg-[#131920] focus:ring-2 focus:ring-[#B8902A] dark:focus:ring-[#D4A843] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#B8902A] focus:ring-[#B8902A]" defaultChecked />
                <span className="text-sm text-[#9A8E80] dark:text-[#8A8070]">Ingat saya</span>
              </label>
              <button type="button" className="text-sm font-medium text-[#B8902A] dark:text-[#D4A843] hover:underline">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#1E1810] dark:bg-[#D4A843] text-white dark:text-[#1E1810] rounded-xl font-semibold hover:bg-black dark:hover:bg-[#e5b954] transition-colors shadow-lg shadow-black/5 dark:shadow-[#D4A843]/20"
            >
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
