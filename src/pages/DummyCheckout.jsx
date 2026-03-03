import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, Shield, CreditCard, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function DummyCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const plan = searchParams.get('plan') || 'Premium';
  const amount = searchParams.get('amount') || '149000';

  const transactionId = searchParams.get('id') || `DUMMY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    document.title = 'AsetSantun';
  }, []);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call our dummy webhook endpoint with Mayar-like payload
      const response = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: 'payment.success',
          data: {
            id: transactionId,
            status: 'PAID',
            amount: amount,
            customer_email: 'antarapi38@gmail.com'
          }
        })
      });

      if (response.ok) {
        // Update local state to reflect premium status
        localStorage.setItem('wd_isPremium', 'true');

        setIsSuccess(true);
        addToast('Pembayaran berhasil! Akun Anda sekarang Premium.', 'success');

        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Webhook failed');
      }
    } catch (error) {
      addToast('Terjadi kesalahan saat memproses pembayaran.', 'error');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pembayaran Berhasil!</h2>
          <p className="text-gray-600">
            Terima kasih, pembayaran Anda untuk paket <strong>{plan}</strong> telah kami terima.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Mengarahkan kembali ke dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="font-bold text-gray-900 text-lg">Mayar.id (Sandbox)</span>
          </div>
        </div>

        {/* Checkout Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
            <h1 className="text-3xl font-bold text-gray-900">
              Rp {parseInt(amount).toLocaleString('id-ID')}
            </h1>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-gray-900">ORD-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Item</span>
              <span className="font-medium text-gray-900">Paket {plan} AsetSantun</span>
            </div>
          </div>

          {/* Payment Simulation Area */}
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Mode Sandbox Aktif</p>
                <p>Ini adalah halaman simulasi pembayaran. Tidak ada dana nyata yang akan dipotong dari akun Anda.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Metode Pembayaran Simulasi
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50 cursor-not-allowed opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <span className="font-medium text-gray-700">Virtual Account / QRIS</span>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                </>
              ) : (
                'Bayar Sekarang'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
            Secured by Mayar.id Sandbox Environment
          </div>
        </div>
      </div>
    </div>
  );
}
