const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendOTPEmail = async (email, otp) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Your Login OTP";
  sendSmtpEmail.htmlContent = `<html><body><h1>Code: ${otp}</h1><p>Use this to verify your CRM account.</p></body></html>`;
  sendSmtpEmail.sender = { name: "CRM Admin", email: "your-email@example.com" };
  sendSmtpEmail.to = [{ email: email }];

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};