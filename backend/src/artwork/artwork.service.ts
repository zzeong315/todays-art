import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';
import { PrismaService } from '../prisma/prisma.service';

interface ArtworkApiData {
  id: number;
  title: string;
  image_id: string | null;
  artist_title: string | null;
  description?: string;
  medium_display?: string;
  date_display?: string;
  place_of_origin?: string;
}

function cleanText(input: string, maxLength: number = 500): string {
  if (!input) return '';
  const withoutHtml = input.replace(/<[^>]*>/g, '');
  const trimmed = withoutHtml.trim().replace(/\s+/g, ' ');
  return trimmed.length > maxLength
    ? trimmed.slice(0, maxLength) + '...'
    : trimmed;
}

@Injectable()
export class ArtworkService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  // ✅ 유명 작가 기반 무작위 작품 가져오기
  private async getArtworkByRandomFamousArtist(): Promise<ArtworkApiData | null> {
    const famousArtists = [
      'Vincent van Gogh',
      'Claude Monet',
      'Pablo Picasso',
      'Edgar Degas',
      'Henri Matisse',
      'Rembrandt',
      'Henri de Toulouse-Lautrec',
      'Paul Cézanne',
      'Pierre-Auguste Renoir',
      'Édouard Manet',
    ];

    const randomArtist =
      famousArtists[Math.floor(Math.random() * famousArtists.length)];
    const fields = [
      'id',
      'title',
      'image_id',
      'artist_title',
      'description',
      'medium_display',
      'date_display',
      'place_of_origin',
    ].join(',');

    const searchUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
      randomArtist,
    )}&limit=10&fields=${fields}&has_not_been_viewed_much=false`;

    const res = await this.httpService.axiosRef.get(searchUrl);
    const artworks = res.data?.data as ArtworkApiData[];

    if (!artworks || artworks.length === 0) {
      console.warn(`No artworks found for artist: ${randomArtist}`);
      return null;
    }

    return artworks[Math.floor(Math.random() * artworks.length)];
  }

  // ✅ 오늘의 작품 저장
  async setTodayArtwork() {
    const today = dayjs().startOf('day').toDate();

    const exists = await this.prisma.dailyArtwork.findUnique({
      where: { date: today },
    });
    if (exists) return exists;

    const artwork = await this.getArtworkByRandomFamousArtist();
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
        description: cleanText(artwork.description || ''),
        medium: cleanText(artwork.medium_display || ''),
        dateDisplay: cleanText(artwork.date_display || ''),
        origin: cleanText(artwork.place_of_origin || ''),
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
