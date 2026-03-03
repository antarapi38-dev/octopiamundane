import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.MAYAR_API_KEY;
const requestBody = {
  name: `Paket Premium Plan 1 Bulan AsetSantun`,
  amount: 99000,
  description: `Pembayaran layanan Premium Plan 1 Bulan di aplikasi AsetSantun.`,
  email: "antarapi38@gmail.com",
  mobile: "081234567890",
  redirectURL: `http://localhost:3000/payment-callback`
};

async function test() {
  console.log("Using API Key:", apiKey ? apiKey.substring(0, 15) + "..." : "NONE");
  const response = await fetch('https://api.mayar.club/hl/v1/payment/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));
}

test();
