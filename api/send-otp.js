import twilio from 'twilio';

export default async function handler(req, res) {
  // Add CORS headers for local development if needed, though Vercel handles this for same-domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { phone, otp } = req.body;

  // Strip all spaces and ensure proper format
  if (phone) phone = phone.replace(/\s+/g, '').trim();

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const TWILIO_API_KEY_SID    = process.env.TWILIO_API_KEY_SID;
  const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET;
  const TWILIO_ACCOUNT_SID    = process.env.TWILIO_ACCOUNT_SID;

  if (!TWILIO_API_KEY_SID || !TWILIO_API_KEY_SECRET || !TWILIO_ACCOUNT_SID) {
    return res.status(500).json({ error: 'Twilio credentials not configured on server' });
  }

  try {
    const client = twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
      accountSid: TWILIO_ACCOUNT_SID
    });

    const message = await client.messages.create({
      body: `🔐 *QueueSmart KYC OTP*\n\nYour verification code is: *${otp}*\n\nValid for 10 minutes. Do not share this code with anyone.`,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${phone}`
    });

    return res.status(200).json({ success: true, channel: 'whatsapp', sid: message.sid });
  } catch (error) {
    console.error('[TWILIO ERROR]', error.message);
    return res.status(500).json({ error: error.message });
  }
}
