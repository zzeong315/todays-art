import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';
import { PrismaService } from '../prisma/prisma.service';

interface ArtworkApiData {
  id: number;
  title: string;
  image_id: string | null;
  artist_title: string | null;
}

@Injectable()
export class ArtworkService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  private async getTotalArtworks(): Promise<number> {
    try {
      const res = await this.httpService.axiosRef.get(
        'https://api.artic.edu/api/v1/artworks?limit=1',
      );
      const data = res.data as { pagination?: { total?: number } };
      return data.pagination?.total ?? 0;
    } catch (error) {
      console.error('Error fetching total artworks:', error);
      return 0;
    }
  }

  private async getArtworkByPage(page: number): Promise<ArtworkApiData | null> {
    try {
      const fields = ['id', 'title', 'image_id', 'artist_title'].join(',');
      const res = await this.httpService.axiosRef.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=1&fields=${fields}`,
      );
      const data = res.data as { data: ArtworkApiData[] };
      return data.data[0] ?? null;
    } catch (error) {
      console.error(`Error fetching artwork for page ${page}:`, error);
      return null;
    }
  }

  async setTodayArtwork() {
    const today = dayjs().startOf('day').toDate();

    const exists = await this.prisma.dailyArtwork.findUnique({
      where: { date: today },
    });
    if (exists) return exists;

    const total = await this.getTotalArtworks();
    const randomPage = Math.floor(Math.random() * total);
    const artwork = await this.getArtworkByPage(randomPage);

    if (!artwork) {
      throw new Error('Artwork could not be fetched');
    }

    const imageUrl = artwork.image_id
      ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
      : '';

    return this.prisma.dailyArtwork.create({
      data: {
        date: today,
        artworkId: artwork.id,
        title: artwork.title,
        artist: artwork.artist_title || '',
        imageUrl,
      },
    });
  }

  async getTodayArtwork() {
    const today = dayjs().startOf('day').toDate();
    const artwork = await this.prisma.dailyArtwork.findUnique({
      where: { date: today },
    });
    return artwork;
  }
}
