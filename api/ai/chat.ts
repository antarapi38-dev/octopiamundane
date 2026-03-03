import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterKey) {
        console.error('[AI] OPENROUTER_API_KEY tidak ditemukan di environment variables');
        return res.status(500).json({
            success: false,
            message: 'API Key AI belum dikonfigurasi di server. Tambahkan OPENROUTER_API_KEY di Environment Variables.',
        });
    }

    try {
        const { messages } = req.body;

        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const referer = process.env.APP_URL || `${protocol}://${host}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openrouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': referer,
                'X-Title': 'AsetSantun',
            },
            body: JSON.stringify({
                model: 'qwen/qwen3-vl-235b-a22b-thinking',
                messages,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[AI] OpenRouter Error:', response.status, data);
            return res.status(response.status).json({
                success: false,
                message: data?.error?.message || 'Gagal menghubungi AI.',
                error: data,
            });
        }

        return res.json(data);
    } catch (error) {
        console.error('[AI] Internal Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan internal saat menghubungi AI.',
        });
    }
}
