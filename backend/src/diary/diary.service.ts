import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  async writeDiary(userId: number, content: string) {
    const today = dayjs().startOf('day').toDate();
    const artwork = await this.prisma.dailyArtwork.findUnique({
      where: { date: today },
    });

    if (!artwork) {
      throw new Error('오늘의 작품이 없습니다.');
    }

    return this.prisma.diary.create({
      data: {
        userId,
        artworkId: artwork.id,
        content,
      },
    });
  }

  async getUserDiaries(userId: number) {
    return this.prisma.diary.findMany({
      where: { userId },
      include: {
        artwork: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTodayDiary(userId: number) {
    const startOfToday = dayjs().startOf('day').toDate();
    const endOfToday = dayjs().endOf('day').toDate();

    return this.prisma.diary.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        artwork: true,
      },
    });
  }
}
