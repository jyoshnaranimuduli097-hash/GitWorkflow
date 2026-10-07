import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      // Tells Passport to look inside httpOnly cookies (or Authorization header)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET')!,
    });
  }

  // Automatically triggered ONLY IF signature & expiration are valid
  async validate(payload: any) {
    // Whatever you return here becomes req.user
    console.log('JWT VALIDATED:', payload);
    // const user = await this.userService.findById(payload.sub);
    // console.log(user);
    return {
      userId : payload.sub ,
      email : payload.email,
      role : payload.role
    };
  }
}
