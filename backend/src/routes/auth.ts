import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../db';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'Invalid Google Token' });

    const { email, name, picture } = payload;
    if (!email) return res.status(400).json({ error: 'Email not provided by Google' });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar: picture
        }
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          avatar: picture || user.avatar
        }
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
