import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNotificationEmail = async (to, messageData) => {
  const { name, email, subject, message } = messageData;

  const mailOptions = {
    from: `"Bakaba Stone" <${process.env.EMAIL_USER}>`,
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
