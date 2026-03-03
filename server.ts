import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint to create a payment link
app.post("/api/payment/create", async (req, res) => {
  const { plan, amount } = req.body;

  const apiKey = process.env.MAYAR_API_KEY;

  // Dynamically build the exact app URL from the incoming request in Back4App
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const appUrl = process.env.APP_URL || `${protocol}://${host}`;

  const customerEmail = "antarapi38@gmail.com";
  const customerMobile = "081234567890";

  const isSandbox = process.env.MAYAR_SANDBOX?.toLowerCase().trim() === 'true';
  const apiBaseUrl = isSandbox ? 'https://api.mayar.club' : 'https://api.mayar.id';

  console.log(`[Payment] Mode: ${isSandbox ? 'SANDBOX (mayar.club)' : 'PRODUCTION (mayar.id)'}`);

  if (!apiKey || apiKey === "YOUR_MAYAR_SECRET_KEY") {
    console.log("[Payment] Menggunakan Dummy Checkout (API Key tidak ditemukan)");
    const checkoutUrl = `/dummy-checkout?plan=${encodeURIComponent(plan)}&amount=${amount}`;
    return res.json({
      success: true,
      checkoutUrl
    });
  }

  try {
    const requestBody = {
      name: `Paket ${plan} AsetSantun`,
      amount: parseInt(amount, 10),
      description: `Pembayaran layanan ${plan} di aplikasi AsetSantun.`,
      email: customerEmail,
      mobile: customerMobile,
      redirectURL: `${appUrl}/payment-callback`
    };

    const response = await fetch(`${apiBaseUrl}/hl/v1/payment/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok && data.data && data.data.link) {
      if (isSandbox) {
        const transactionId = data.data.transactionId || data.data.transaction_id || data.data.id;
        const dummyUrl = `/dummy-checkout?plan=${encodeURIComponent(plan)}&amount=${amount}&id=${transactionId}`;
        return res.json({
          success: true,
          checkoutUrl: dummyUrl
        });
      }

      return res.json({
        success: true,
        checkoutUrl: data.data.link
      });
    } else {
      let errorMsg = "Gagal membuat link pembayaran Mayar.id";
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
        error: data
      });
    }
  } catch (error) {
    console.error("[Payment] Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
});

app.post("/api/payment/webhook", (req, res) => {
  const payload = req.body;
  const event = payload.event;
  const data = payload.data;

  if (event === 'payment.success' || (data && data.status === 'PAID')) {
    res.json({ success: true, message: "Webhook received - payment confirmed" });
  } else {
    const { status, plan } = payload;
    if (status === 'SUCCESS') {
      res.json({ success: true, message: "Payment confirmed" });
    } else {
      res.json({ success: true, message: "Webhook received" });
    }
  }
});

// ============================================================
// AI Chat Proxy — API Key aman di server, tidak terekspos di frontend/GitHub
// ============================================================
app.post("/api/ai/chat", async (req, res) => {
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  if (!openrouterKey) {
    console.error("[AI] OPENROUTER_API_KEY tidak ditemukan di environment variables");
    return res.status(500).json({
      success: false,
      message: "API Key AI belum dikonfigurasi di server."
    });
  }

  try {
    const { messages } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'AsetSantun'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-vl-235b-a22b-thinking',
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[AI] OpenRouter Error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        message: data?.error?.message || "Gagal menghubungi AI.",
        error: data
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("[AI] Internal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal saat menghubungi AI."
    });
  }
});

import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Gunakan dynamic import agar Vercel tidak crash mencari module 'vite' (devDependencies)
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the React app build directory
    app.use(express.static(path.join(__dirname, 'dist')));

    // All unknown GET requests not matching an API route should be handled by React Router
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
