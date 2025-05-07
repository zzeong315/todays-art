import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DiaryService } from './diary.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    // 필요하다면 더 많은 속성을 추가하세요 (예: email, name 등)
  };
}

@UseGuards(JwtAuthGuard)
@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  async writeDiary(
    @Req() req: AuthenticatedRequest,
    @Body('content') content: string,
  ) {
    const userId = req.user.id;
    return this.diaryService.writeDiary(userId, content);
  }

  @Get('me')
  async getMyDiaries(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.diaryService.getUserDiaries(userId);
  }

  @Get('me/today')
  async getTodayDiary(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.diaryService.getTodayDiary(userId);
  }
}
