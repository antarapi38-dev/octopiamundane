import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight (prevents 405 on browsers that send OPTIONS first)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { plan, amount } = req.body || {};

    if (!plan || !amount) {
        return res.status(400).json({ success: false, message: 'Parameter plan dan amount wajib diisi' });
    }

    const apiKey = process.env.MAYAR_API_KEY;

    if (!apiKey) {
        console.error('[Payment] MAYAR_API_KEY not set!');
        return res.status(500).json({ success: false, message: 'Konfigurasi server error: MAYAR_API_KEY belum diatur.' });
    }

    // Build app URL from request headers or env
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const appUrl = process.env.APP_URL || `${protocol}://${host}`;

    const customerEmail = 'antarapi38@gmail.com';
    const customerMobile = '081234567890';

    // MAYAR_SANDBOX controls behavior AFTER API call (redirect to dummy checkout vs real link)
    // API endpoint is ALWAYS api.mayar.id because api.mayar.club is deprecated/unavailable
    const isSandbox = process.env.MAYAR_SANDBOX?.toLowerCase().trim() === 'true';
    const apiBaseUrl = 'https://api.mayar.id';

    console.log(`[Payment] Mode: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}, API: ${apiBaseUrl}`);

    try {
        const requestBody = {
            name: `Paket ${plan} AsetSantun`,
            amount: parseInt(String(amount), 10),
            description: `Pembayaran layanan ${plan} di aplikasi AsetSantun.`,
            email: customerEmail,
            mobile: customerMobile,
            redirectURL: `${appUrl}/payment-callback`,
        };

        console.log(`[Payment] Calling Mayar API: ${apiBaseUrl}/hl/v1/payment/create`);

        const response = await fetch(`${apiBaseUrl}/hl/v1/payment/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log(`[Payment] Mayar API responded with status: ${response.status}`);

        const data = await response.json();

        // Handle errors from Mayar
        if (!response.ok) {
            console.error(`[Payment] Mayar API Error (${response.status}):`, JSON.stringify(data));

            let errorMsg = `Gagal membuat pembayaran (Error ${response.status})`;
            if (response.status === 401) {
                errorMsg = 'API Key Mayar tidak valid. Periksa kembali MAYAR_API_KEY.';
            } else if (response.status === 429) {
                errorMsg = 'Terlalu banyak permintaan. Silakan tunggu beberapa saat dan coba lagi.';
            } else if (data.messages) {
                errorMsg = typeof data.messages === 'string' ? data.messages : JSON.stringify(data.messages);
            } else if (data.errors) {
                errorMsg = typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors);
            }

            return res.status(response.status).json({ success: false, message: errorMsg });
        }

        // Success: extract payment link & transaction ID
        if (data.data && data.data.link) {
            if (isSandbox) {
                // SANDBOX: Mayar API berhasil dipanggil, tapi redirect ke dummy checkout
                // agar tidak terjadi transaksi uang sungguhan
                const transactionId = data.data.transactionId || data.data.transaction_id || data.data.id;
                const dummyUrl = `/dummy-checkout?plan=${encodeURIComponent(plan)}&amount=${amount}&id=${transactionId}`;
                console.log(`[Payment] Sandbox → Dummy Checkout (txId: ${transactionId})`);
                return res.json({ success: true, checkoutUrl: dummyUrl });
            }

            // PRODUCTION: redirect ke link pembayaran Mayar asli
            console.log(`[Payment] Production → Mayar link: ${data.data.link}`);
            return res.json({ success: true, checkoutUrl: data.data.link });
        }

        // Unexpected: Mayar returned 200 but no payment link
        console.error('[Payment] Mayar returned 200 but no link:', JSON.stringify(data));
        return res.status(502).json({
            success: false,
            message: 'Mayar tidak mengembalikan link pembayaran. Silakan coba lagi.',
        });

    } catch (error: any) {
        console.error('[Payment] Internal Error:', error?.message || error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghubungi server pembayaran Mayar.',
        });
    }
}
