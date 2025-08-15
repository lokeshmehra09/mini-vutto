const sgMail = require('@sendgrid/mail');
require('dotenv').config({ path: './env.config' });

// Configure SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email using SendGrid
const sendOTPEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: process.env.VERIFIED_SENDER || 'noreply@yourdomain.com',
      subject: 'Verify Your Email - Mini Vutto',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">🚲 Mini Vutto</h1>
            <p style="color: #666; font-size: 18px; margin: 10px 0;">Used Bike Listings Platform</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Email Verification Required</h2>
            <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 25px;">
              Please use the following verification code to complete your registration:
            </p>
            
            <div style="background-color: #007bff; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h1 style="font-size: 36px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
              This code will expire in 10 minutes.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you didn't request this verification, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              Mini Vutto - Your trusted platform for used bike listings
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};
