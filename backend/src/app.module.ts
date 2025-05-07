import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ArtworkModule } from './artwork/artwork.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DiaryModule } from './diary/diary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env 자동 로드
    ScheduleModule.forRoot(),
    AuthModule,
    ArtworkModule,
    DiaryModule,
  ],
  // controllers: [AppController],
  // providers: [AppService, PrismaService],
})
export class AppModule {}
