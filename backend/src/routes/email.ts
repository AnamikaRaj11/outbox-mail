import express from 'express';
import { prisma } from '../db';
import { emailQueue } from '../queues/emailQueue';

const router = express.Router();

router.post('/schedule', async (req, res) => {
  try {
    const { subject, body, leads, scheduledAt, userId, hourlyLimit, delayBetweenEmails } = req.body;
    // leads should be an array of email strings for now
    
    // In a real app, userId comes from auth middleware
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const scheduledTime = new Date(scheduledAt);
    const delay = Math.max(0, scheduledTime.getTime() - Date.now());

    for (const leadEmail of leads) {
      const emailRecord = await prisma.email.create({
        data: {
          subject,
          body,
          recipient: leadEmail,
          status: 'SCHEDULED',
          scheduledAt: scheduledTime,
          userId: user.id
        }
      });

      await emailQueue.add('send-email', {
        to: leadEmail,
        subject,
        body,
        emailId: emailRecord.id,
        senderId: user.id
      }, {
        delay
      });
    }

    res.json({ message: 'Emails scheduled successfully', count: leads.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/scheduled', async (req, res) => {
  const { userId } = req.query;
  const emails = await prisma.email.findMany({
    where: { userId: String(userId), status: 'SCHEDULED' },
    orderBy: { scheduledAt: 'asc' }
  });
  res.json(emails);
});

router.get('/sent', async (req, res) => {
  const { userId } = req.query;
  const emails = await prisma.email.findMany({
    where: { userId: String(userId), status: 'SENT' },
    orderBy: { sentAt: 'desc' }
  });
  res.json(emails);
});

export default router;
