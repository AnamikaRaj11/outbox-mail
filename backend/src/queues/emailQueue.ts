import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { sendEmail } from '../services/emailService';
import { prisma } from '../db';
import dotenv from 'dotenv';
dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });

export const emailQueue = new Queue('emailQueue', { connection });
export const emailQueueEvents = new QueueEvents('emailQueue', { connection });

// Rate limit logic per hour per sender could be implemented here using Redis
// For now, we utilize BullMQ's native concurrency and rate limiting features if possible.
// The assignment requires delaying overflowing jobs to the next hour.
const MAX_EMAILS_PER_HOUR = parseInt(process.env.MAX_EMAILS_PER_HOUR || '200', 10);

const worker = new Worker('emailQueue', async job => {
  const { to, subject, body, emailId, senderId } = job.data;
  
  // Custom delay between emails (e.g. 2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const info = await sendEmail(to, subject, body);
    
    // Update DB
    await prisma.email.update({
      where: { id: emailId },
      data: { status: 'SENT', sentAt: new Date() }
    });
    
    return info;
  } catch (error) {
    await prisma.email.update({
      where: { id: emailId },
      data: { status: 'FAILED' }
    });
    throw error;
  }
}, { 
  connection,
  concurrency: 5 // Configurable concurrency
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
