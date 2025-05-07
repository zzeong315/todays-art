import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService, PrismaService],
})
export class DiaryModule {}
