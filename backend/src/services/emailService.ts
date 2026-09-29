import nodemailer from 'nodemailer';

// Ethereal Email (Fake SMTP) config
// We create a test account dynamically if credentials are not provided, 
// but for production-grade assignment it's better to hardcode or generate once.

let transporter: nodemailer.Transporter | null = null;

export const getTransporter = async () => {
  if (transporter) return transporter;

  // Generate test SMTP service account from ethereal.email
  // In a real app, use .env for SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter;
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: '"ReachInbox Test" <test@reachinbox.ai>',
    to,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  return info;
};
