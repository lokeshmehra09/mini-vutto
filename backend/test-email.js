const { sendOTPEmail } = require('./utils/emailService');
require('dotenv').config({ path: './env.config' });

async function testEmail() {
  console.log('🧪 Testing SendGrid Email Configuration...');
  console.log('🔑 SendGrid API Key:', process.env.SENDGRID_API_KEY ? '***SET***' : 'NOT SET');
  console.log('📧 Verified Sender:', process.env.VERIFIED_SENDER || 'NOT SET');
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('');
  
  if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ SENDGRID_API_KEY not set in env.config');
    console.log('📝 Please add your SendGrid API key to env.config');
    return;
  }
  
  try {
    const testOTP = '123456';
    const testEmail = 'lmehra2825@gmail.com'; // Your test email
    
    console.log('📤 Sending test email to:', testEmail);
    console.log('🔑 Test OTP:', testOTP);
    console.log('');
    
    const result = await sendOTPEmail(testEmail, testOTP);
    
    if (result) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Check your inbox for OTP: 123456');
    } else {
      console.log('❌ Email failed to send');
    }
  } catch (error) {
    console.error('❌ Error testing email:', error.message);
  }
}

testEmail();
