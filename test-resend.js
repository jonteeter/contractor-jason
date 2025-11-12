// Simple Resend API Test
// Run: node test-resend.js YOUR_EMAIL@example.com

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmail = process.argv[2];

if (!testEmail) {
  console.error('Usage: node test-resend.js YOUR_EMAIL@example.com');
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🚀 Testing Resend API...');
console.log(`📧 Sending test email to: ${testEmail}`);
console.log('');

resend.emails.send({
  from: 'Tary Test <onboarding@resend.dev>',
  to: testEmail,
  subject: 'Test Email from Tary',
  html: '<h1>Success!</h1><p>Your Resend integration is working perfectly!</p>'
})
.then(result => {
  console.log('✅ Email sent successfully!');
  console.log('📨 Email ID:', result.data.id);
  console.log('');
  console.log('Check your inbox at:', testEmail);
})
.catch(error => {
  console.error('❌ Error sending email:');
  console.error(error);
  process.exit(1);
});
