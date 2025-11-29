/**
 * Messaging configuration
 */
export const messagingConfig = {
  sms: {
    provider: process.env.SMS_PROVIDER || 'hubtel',
    hubtel: {
      clientId: process.env.HUBTEL_SMS_CLIENT_ID || '',
      clientSecret: process.env.HUBTEL_SMS_CLIENT_SECRET || '',
      senderId: process.env.HUBTEL_SMS_SENDER_ID || 'SchoolFees',
    },
    mNotify: {
      apiKey: process.env.MNOTIFY_API_KEY || '',
      senderId: process.env.MNOTIFY_SENDER_ID || 'SchoolFees',
    },
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'School Fees <noreply@schoolfees.com>',
  },
};

