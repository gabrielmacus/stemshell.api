import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// http://cryto.net/%7Ejoepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
// http://cryto.net/%7Ejoepie91/blog/2016/06/19/stop-using-jwt-for-sessions-part-2-why-your-solution-doesnt-work/ç

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}