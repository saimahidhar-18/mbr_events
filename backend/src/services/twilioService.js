// Twilio wrapper (simple). Use environment variables to configure.
const twilio = require('twilio');
const client = process.env.TWILIO_ACCOUNT_SID ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;

async function sendSms(to, body) {
  if (!client) {
    console.log('Twilio client not configured. SMS stub:', to, body);
    return;
  }
  return client.messages.create({ body, from: process.env.TWILIO_FROM, to });
}

module.exports = { sendSms };
