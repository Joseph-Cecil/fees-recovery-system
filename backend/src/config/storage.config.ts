/**
 * Storage configuration
 */
export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 's3',
  s3: {
    bucket: process.env.S3_BUCKET || 'school-fees-storage',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    endpoint: process.env.S3_ENDPOINT || undefined,
  },
  local: {
    path: process.env.LOCAL_STORAGE_PATH || './uploads',
  },
};

