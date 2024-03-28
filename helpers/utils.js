// emailService.js
const nodemailer = require('nodemailer');

async function sendMail({ from, to, subject, text, html }) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'soumalya@netfotech.in', // Your Gmail email address
      pass: 'upvzivtwgaidkahv' // Your Gmail password
    }
  });

  // Define email options
  const mailOptions = {
    from, // Sender email address
    to, // Recipient email address
    subject, // Email subject
    text, // Plain text body
    html // HTML body (optional)
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true; // Email sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = { sendMail };
