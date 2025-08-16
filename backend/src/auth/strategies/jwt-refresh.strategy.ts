import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  email: string;
}

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies) => {
          console.log('🔍 JWT Extractor - All cookies:', req?.cookies);
          const token = req?.cookies?.refreshToken ?? null;
          console.log('🔍 JWT Extractor - Refresh token:', token ? `Found (${token.length} chars)` : 'Not found');
          return token;
        },
      ]),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(
    req: RequestWithCookies,
    payload: JwtPayload,
  ): JwtPayload & { refreshToken: string } {
    console.log('🔍 Refresh Strategy - cookies:', req.cookies);
    console.log('🔍 Refresh Strategy - payload:', payload);
    
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      console.log('❌ No refresh token found in cookies');
      throw new UnauthorizedException('No refresh token found');
    }

    console.log('✅ Refresh token found, length:', refreshToken.length);
    return { ...payload, refreshToken };
  }
}
