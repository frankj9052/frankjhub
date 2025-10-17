import express from 'express';

export async function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.disable('x-powered-by');
}
