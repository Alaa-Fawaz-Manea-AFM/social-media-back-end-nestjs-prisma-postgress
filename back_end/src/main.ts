import { GlobalExceptionFilter } from './globalErrorHandler';
import { ValidationPipe } from '@nestjs/common';
import { WinstonConfig } from './utils/logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonConfig,
  });

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(json());
  const allowedOrigins = [
    'http://localhost:3000',
    'https://social-media-back-end.herokuapp.com',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  app.enableShutdownHooks();
  await app.listen(process.env.PORT || 3001);
}

bootstrap();
