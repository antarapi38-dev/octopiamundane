import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
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
