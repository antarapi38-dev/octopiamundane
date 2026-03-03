import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { getData, setData } from './lib/storage';
import { mockAssets, mockHeirs, mockDocuments, mockNotifications, mockTransactions } from './data/mockData';

import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Aset from './pages/Aset';
import AhliWaris from './pages/AhliWaris';
import Kalkulator from './pages/Kalkulator';
import Brankas from './pages/Brankas';
import Wasiat from './pages/Wasiat';
import AIAdvisor from './pages/AIAdvisor';
import Pembayaran from './pages/Pembayaran';
import Notifikasi from './pages/Notifikasi';
import DummyCheckout from './pages/DummyCheckout';
import PaymentCallback from './pages/PaymentCallback';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = getData('wd_isLoggedIn', 'false');
  if (isLoggedIn !== 'true') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  useEffect(() => {
    // Seed initial data if not exists
    if (!localStorage.getItem('wd_assets')) setData('wd_assets', mockAssets);
    if (!localStorage.getItem('wd_heirs')) setData('wd_heirs', mockHeirs);
    if (!localStorage.getItem('wd_documents')) setData('wd_documents', mockDocuments);
    if (!localStorage.getItem('wd_notifications')) setData('wd_notifications', mockNotifications);
    if (!localStorage.getItem('wd_transactions')) setData('wd_transactions', mockTransactions);
    if (!localStorage.getItem('wd_theme')) setData('wd_theme', 'light');
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="aset" element={<Aset />} />
            <Route path="ahli-waris" element={<AhliWaris />} />
            <Route path="kalkulator" element={<Kalkulator />} />
            <Route path="brankas" element={<Brankas />} />
            <Route path="wasiat" element={<Wasiat />} />
            <Route path="ai-advisor" element={<AIAdvisor />} />
            <Route path="pembayaran" element={<Pembayaran />} />
            <Route path="notifikasi" element={<Notifikasi />} />
          </Route>
          <Route path="/dummy-checkout" element={<DummyCheckout />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
