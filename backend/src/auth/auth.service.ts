import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async signup(dto: SignupDto) {
    const { nickname, email, password } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already is use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, nickname },
    });

    return { message: 'Signup successful', userId: user.id };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // DB에 refresh token 저장 (hashed)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    console.log('hashedRefreshToken', hashedRefreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    };
  }

  // 로그아웃 시 refresh token 삭제
  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  // refresh token 재발급 (토큰 회전 적용)
  async refreshTokens(userId: number, refreshToken: string) {
    // Transaction을 사용해서 race condition 방지
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 1. 현재 refresh token 검증
      const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!isValid) {
        // 잘못된 토큰이면 즉시 모든 토큰 무효화 (보안 강화)
        await prisma.user.update({
          where: { id: user.id },
          data: { hashedRefreshToken: null },
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { sub: user.id, email: user.email };

      // 2. 새로운 토큰들 생성
      const newAccessToken = await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      });

      const newRefreshToken = await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      // 3. 기존 토큰 무효화와 새 토큰 저장을 동시에 (원자적 연산)
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken: hashedNewRefreshToken },
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    });
  }
}
