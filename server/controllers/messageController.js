import Message from '../models/Message.js';
import Settings from '../models/Settings.js';
import { sendNotificationEmail } from '../utils/emailService.js';

// @desc    Créer un nouveau message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    const savedMessage = await newMessage.save();

    // Envoyer notification par mail
    try {
      const settings = await Settings.findOne();
      const recipientEmail = settings?.contactEmail || process.env.SMTP_USER;
      
      if (recipientEmail && settings?.notifications?.email) {
        await sendNotificationEmail(recipientEmail, { name, email, subject, message });
      }
    } catch (emailErr) {
      console.error('Erreur notification email:', emailErr);
      // On ne bloque pas la réponse si le mail échoue
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Récupérer tous les messages
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer un message par ID
// @route   GET /api/messages/:id
// @access  Private (Admin)
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Marquer comme lu automatiquement lors de l'ouverture détaillée
    if (!message.read) {
        message.read = true;
        await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    await message.deleteOne();
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Marquer un message comme lu
// @route   PUT /api/messages/:id/read
// @access  Private (Admin)
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    message.read = true;
    const updatedMessage = await message.save();

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
