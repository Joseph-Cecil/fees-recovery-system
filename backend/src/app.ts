/**
 * Express application setup
 */
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './config';
import { errorMiddleware } from './shared/middleware/error.middleware';
import { apiRoutes } from './routes';

/**
 * Create and configure Express app
 */
export function createApp(): Express {
  const app = express();

  // Security middleware
  if (appConfig.isProduction) {
    app.use(helmet());
  }

  // CORS
  app.use(
    cors({
      origin: appConfig.frontendUrl.split(','),
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use(appConfig.apiPrefix, apiRoutes);

  // Error handling (must be last)
  app.use(errorMiddleware);

  return app;
}

