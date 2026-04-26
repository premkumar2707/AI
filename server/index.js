import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// ─── Twilio Credentials (loaded from .env) ─────────────────────────────────
const TWILIO_API_KEY_SID    = process.env.TWILIO_API_KEY_SID;
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET;
const TWILIO_ACCOUNT_SID    = process.env.TWILIO_ACCOUNT_SID;

if (!TWILIO_API_KEY_SID || !TWILIO_API_KEY_SECRET || !TWILIO_ACCOUNT_SID) {
  console.error('[ERROR] Missing Twilio credentials in .env file!');
}

const client = twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID
});
console.log('[TWILIO] Client initialized successfully!');

// ─── Send OTP via WhatsApp Sandbox (FREE, no registration needed) ───────────
// To use: Join the sandbox first by sending "join <your-sandbox-word>" to +14155238886
// WhatsApp: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
app.post('/api/send-otp', async (req, res) => {
    let { phone, otp } = req.body;
    
    // Strip all spaces and ensure proper format: +916363762499
    if (phone) phone = phone.replace(/\s+/g, '').trim();
    
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }


    try {
        console.log(`[TWILIO] Sending OTP ${otp} via WhatsApp to ${phone}...`);
        
        // Twilio WhatsApp Sandbox - FREE, works immediately for India
        const message = await client.messages.create({
            body: `🔐 *QueueSmart KYC OTP*\n\nYour verification code is: *${otp}*\n\nValid for 10 minutes. Do not share this code with anyone.`,
            from: 'whatsapp:+14155238886', // Twilio's permanent WhatsApp Sandbox number
            to: `whatsapp:${phone}`        // e.g. whatsapp:+918217315852
        });
        
        console.log(`[TWILIO WhatsApp] Sent! SID: ${message.sid}`);
        res.json({ success: true, channel: 'whatsapp', sid: message.sid });
    } catch (error) {
        console.error('[TWILIO ERROR]', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Backend server running at http://localhost:3001');
});
