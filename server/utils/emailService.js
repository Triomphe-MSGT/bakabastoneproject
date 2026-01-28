import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT, // 465 for SSL, 587 for TLS
  secure: process.env.SMTP_PORT == 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendNotificationEmail = async (to, messageData) => {
  const { name, email, subject, message } = messageData;

  const mailOptions = {
    from: `"Liteos Site Vitrine" <${process.env.SMTP_USER}>`,
    to,
    subject: `Nouveau message: ${subject}`,
    html: `
      <h2>Vous avez reçu un nouveau message de contact</h2>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Sujet:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Ce message a été envoyé depuis le formulaire de contact de votre site vitrine.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envois de l\'email:', error);
    return false;
  }
};
