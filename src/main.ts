import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable cookie parser middleware
  app.use(cookieParser());
  const configService = app.get(ConfigService)
  const PORT : number = configService.get<number>('PORT')  ?? 5000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
await bootstrap();
