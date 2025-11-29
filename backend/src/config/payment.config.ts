/**
 * Payment provider configuration
 */
export const paymentConfig = {
  provider: process.env.PAYMENT_PROVIDER || 'paystack',
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
  },
  hubtel: {
    clientId: process.env.HUBTEL_CLIENT_ID || '',
    clientSecret: process.env.HUBTEL_CLIENT_SECRET || '',
    merchantAccount: process.env.HUBTEL_MERCHANT_ACCOUNT || '',
    webhookSecret: process.env.HUBTEL_WEBHOOK_SECRET || '',
  },
};

