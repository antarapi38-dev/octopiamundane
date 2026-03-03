import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { plan, amount } = req.body;

    const apiKey = process.env.MAYAR_API_KEY;

    // Build app URL from request headers or env
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const appUrl = process.env.APP_URL || `${protocol}://${host}`;

    const customerEmail = 'antarapi38@gmail.com';
    const customerMobile = '081234567890';

    const isSandbox = process.env.MAYAR_SANDBOX?.toLowerCase().trim() === 'true';
    const apiBaseUrl = isSandbox ? 'https://api.mayar.club' : 'https://api.mayar.id';

    console.log(`[Payment] Mode: ${isSandbox ? 'SANDBOX (mayar.club)' : 'PRODUCTION (mayar.id)'}`);

    if (!apiKey || apiKey === 'YOUR_MAYAR_SECRET_KEY') {
        console.log('[Payment] Menggunakan Dummy Checkout (API Key tidak ditemukan)');
        const checkoutUrl = `/dummy-checkout?plan=${encodeURIComponent(plan)}&amount=${amount}`;
        return res.json({
            success: true,
            checkoutUrl,
        });
    }

    try {
        const requestBody = {
            name: `Paket ${plan} AsetSantun`,
            amount: parseInt(amount, 10),
            description: `Pembayaran layanan ${plan} di aplikasi AsetSantun.`,
            email: customerEmail,
            mobile: customerMobile,
            redirectURL: `${appUrl}/payment-callback`,
        };

        const response = await fetch(`${apiBaseUrl}/hl/v1/payment/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok && data.data && data.data.link) {
            if (isSandbox) {
                const transactionId = data.data.transactionId || data.data.transaction_id || data.data.id;
                const dummyUrl = `/dummy-checkout?plan=${encodeURIComponent(plan)}&amount=${amount}&id=${transactionId}`;
                return res.json({
                    success: true,
                    checkoutUrl: dummyUrl,
                });
            }

            return res.json({
                success: true,
                checkoutUrl: data.data.link,
            });
        } else {
            let errorMsg = 'Gagal membuat link pembayaran Mayar.id';
            if (data.errors) {
                errorMsg = typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors);
            } else if (data.messages) {
                errorMsg = typeof data.messages === 'string' ? data.messages : JSON.stringify(data.messages);
            }

            const statusCode = response.status || 400;

            console.log(`[Payment] Mayar API Error (${statusCode}):`, errorMsg, data);

            return res.status(statusCode).json({
                success: false,
                message: errorMsg,
                error: data,
            });
        }
    } catch (error) {
        console.error('[Payment] Internal Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        });
    }
}
