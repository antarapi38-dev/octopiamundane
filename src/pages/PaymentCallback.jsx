import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, Home, CreditCard, Loader2 } from 'lucide-react';

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(8);

    // Mayar.id akan redirect kembali ke URL ini setelah pembayaran
    const status = searchParams.get('status') || 'success';
    const isSuccess = status !== 'failed';

    useEffect(() => {
        if (isSuccess) {
            // Set premium status jika pembayaran berhasil
            localStorage.setItem('wd_isPremium', 'true');
        }

        // Auto redirect ke dashboard setelah countdown
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/pembayaran');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSuccess, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 font-sans">
            <div className="max-w-lg w-full">
                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">

                    {/* Status Banner */}
                    <div className={`p-8 text-center ${isSuccess
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                            : 'bg-gradient-to-br from-red-500 to-rose-600'
                        }`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? 'bg-white/20' : 'bg-white/20'
                            } backdrop-blur-sm border-2 border-white/30`}>
                            {isSuccess ? (
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            ) : (
                                <XCircle className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {isSuccess ? 'Pembayaran Berhasil!' : 'Pembayaran Gagal'}
                        </h1>
                        <p className="text-white/80 text-sm md:text-base">
                            {isSuccess
                                ? 'Terima kasih! Pembayaran Anda telah kami terima dan diproses.'
                                : 'Maaf, pembayaran Anda tidak berhasil diproses.'}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Info Box */}
                        <div className={`rounded-2xl p-4 flex items-start gap-3 ${isSuccess
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800'
                                : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'
                            }`}>
                            <CreditCard className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                }`} />
                            <div className="text-sm">
                                <p className={`font-semibold mb-1 ${isSuccess ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'
                                    }`}>
                                    {isSuccess ? 'Pembayaran Dikonfirmasi' : 'Pembayaran Ditolak'}
                                </p>
                                <p className={isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
                                    {isSuccess
                                        ? 'Status akun Anda telah diperbarui. Anda sekarang dapat menikmati semua fitur premium AsetSantun.'
                                        : 'Silakan coba lagi atau gunakan metode pembayaran lain. Hubungi customer support jika masalah berlanjut.'}
                                </p>
                            </div>
                        </div>

                        {/* Powered by Mayar */}
                        <div className="bg-gradient-to-r from-blue-600 to-pink-600 p-[1px] rounded-xl">
                            <div className="bg-white dark:bg-gray-800 rounded-[11px] p-3 flex items-center justify-center gap-2">
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">MAYAR</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Diproses oleh Mayar.id</span>
                            </div>
                        </div>

                        {/* Auto Redirect Info */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Redirect otomatis dalam <strong className="text-gray-700 dark:text-gray-300">{countdown}</strong> detik...</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/pembayaran')}
                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Pembayaran
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${isSuccess
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90'
                                        : 'bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:opacity-90'
                                    }`}
                            >
                                <Home className="w-4 h-4" /> Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
