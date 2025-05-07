import { Controller, Get } from '@nestjs/common';
import { ArtworkService } from './artwork.service';

@Controller('artwork')
export class ArtworkController {
  constructor(private readonly artworkService: ArtworkService) {}

  @Get('today')
  async getToday() {
    const artwork = await this.artworkService.getTodayArtwork();
    if (!artwork) {
      return await this.artworkService.setTodayArtwork();
    }
    return artwork;
  }
}
