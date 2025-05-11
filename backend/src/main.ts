import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✨ 모든 요청에 대해 DTO validation 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 값만 허용
      forbidNonWhitelisted: true, // DTO에 없는 값이 들어오면 에러
      transform: true, // 요청을 DTO 클래스 인스턴스로 자동 변환
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
