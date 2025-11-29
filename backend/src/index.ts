/**
 * Application entry point
 */
import 'dotenv/config';
import { startServer } from './server';

startServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

