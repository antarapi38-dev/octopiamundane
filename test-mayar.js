import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.MAYAR_API_KEY;

async function test() {
  console.log("=== MAYAR API TEST ===");
  console.log("API Key (first 30 chars):", apiKey ? apiKey.substring(0, 30) + "..." : "NONE");
  console.log("MAYAR_SANDBOX:", process.env.MAYAR_SANDBOX);

  // Always use api.mayar.id (api.mayar.club is deprecated)
  const endpoint = 'https://api.mayar.id/hl/v1/payment/create';

  console.log("MAYAR_SANDBOX:", process.env.MAYAR_SANDBOX);
  console.log("Endpoint:", endpoint);
  console.log("");

  const requestBody = {
    name: "Paket Premium Plan 1 Bulan AsetSantun",
    amount: 99000,
    description: "Pembayaran layanan Premium Plan 1 Bulan di aplikasi AsetSantun.",
    email: "antarapi38@gmail.com",
    mobile: "081234567890",
    redirectURL: "https://asetsantun.vercel.app/payment-callback"
  };

  console.log("Request Body:", JSON.stringify(requestBody, null, 2));
  console.log("");

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log("HTTP Status:", response.status, response.statusText);
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));

    if (response.ok && data.data && data.data.link) {
      console.log("\n✅ SUCCESS! Payment link:", data.data.link);
    } else {
      console.log("\n❌ FAILED! Status:", response.status);
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
  }
}

test();
