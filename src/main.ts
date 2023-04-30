import { Logger } from '@nestjs/common';
import initApp from './config/app.config';

async function bootstrap() {

  const PORT = process.env.PORT || 5000;

  const app = await initApp()
  await app.listen(PORT);

  Logger.log(`🚀 Movies server running in ${process.env.NODE_ENV} mode on port ${PORT}`)

}
bootstrap();