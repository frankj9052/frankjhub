import { createApp } from './createApp';
import { createLoggerWithContext } from './modules/common/libs/logger';
import { env } from './config/env';

const serverLogger = createLoggerWithContext('Server');
async function startServer() {
  try {
    serverLogger.info('🚀 Starting server...');
    const app = await createApp();

    app.listen(Number(env.PORT), () => {
      serverLogger.info(`🚀 Server running at http://${env.HOST}:${env.PORT}`);
    });
  } catch (error) {
    serverLogger.error('❌ Server failed to start', error);
    process.exit(1);
  }
}

startServer();
