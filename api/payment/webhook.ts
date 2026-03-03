import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
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

    const payload = req.body;
    const event = payload.event;
    const data = payload.data;

    if (event === 'payment.success' || (data && data.status === 'PAID')) {
        return res.json({ success: true, message: 'Webhook received - payment confirmed' });
    } else {
        const { status } = payload;
        if (status === 'SUCCESS') {
            return res.json({ success: true, message: 'Payment confirmed' });
        } else {
            return res.json({ success: true, message: 'Webhook received' });
        }
    }
}
