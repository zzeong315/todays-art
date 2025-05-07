import { Injectable } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ArtworkScheduler {
  constructor(private readonly artworkService: ArtworkService) {}

  // 매일 자정(0시 0분)에 실행
  @Cron('0 0 * * *')
  async handleCron() {
    console.log('⏰ Running daily artwork scheduler');
    await this.artworkService.setTodayArtwork();
  }
}