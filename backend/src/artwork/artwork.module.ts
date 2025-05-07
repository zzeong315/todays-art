import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { ArtworkController } from './artwork.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { ArtworkScheduler } from './artwork.scheduler';

@Module({
  imports: [HttpModule],
  controllers: [ArtworkController],
  providers: [ArtworkService, PrismaService, ArtworkScheduler],
})
export class ArtworkModule {}
