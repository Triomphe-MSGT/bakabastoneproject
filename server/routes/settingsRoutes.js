import express from 'express';
import Settings from '../models/Settings.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET settings (create default if not exists)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings.siteName = req.body.siteName || settings.siteName;
      settings.siteDescription = req.body.siteDescription || settings.siteDescription;
      settings.contactEmail = req.body.contactEmail || settings.contactEmail;
      settings.phone = req.body.phone || settings.phone;
      settings.address = req.body.address || settings.address;
      settings.workingHours = req.body.workingHours || settings.workingHours;
      settings.whatsappNumber = req.body.whatsappNumber || settings.whatsappNumber;
      settings.facebookUrl = req.body.facebookUrl !== undefined ? req.body.facebookUrl : settings.facebookUrl;
      settings.instagramUrl = req.body.instagramUrl !== undefined ? req.body.instagramUrl : settings.instagramUrl;
      settings.tiktokUrl = req.body.tiktokUrl !== undefined ? req.body.tiktokUrl : settings.tiktokUrl;
      settings.telegramUrl = req.body.telegramUrl !== undefined ? req.body.telegramUrl : settings.telegramUrl;
      settings.aboutImageUrl = req.body.aboutImageUrl !== undefined ? req.body.aboutImageUrl : settings.aboutImageUrl;
      settings.aboutText = req.body.aboutText !== undefined ? req.body.aboutText : settings.aboutText;
      
      if (req.body.notifications) {
        settings.notifications = { ...settings.notifications, ...req.body.notifications };
      }
      
      if (req.body.appearance) {
        settings.appearance = { ...settings.appearance, ...req.body.appearance };
      }
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
