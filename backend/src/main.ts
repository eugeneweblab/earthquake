import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limits each IP to 1000 requests per 15 minutes
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3001', 'https://earthquake-front.vercel.app'],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
