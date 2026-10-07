import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './DTO/registerUser.dto.js';
import { AuthService } from './auth.service.js';
import { loginUserDto } from './DTO/loginUser.dto.js';
import * as express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  checkHealth() {
    return ` i am healthy `;
  }

  @Post('register')
  register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(
    @Body() data: loginUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.login(data);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: ` Login successFully ` };
  }

  @Post('refresh')
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const payload = await this.authService.verifyRefreshToken(refreshToken);

    const tokens = await this.authService.refresh(payload.sub , refreshToken)

        res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: ` Token refreshed successFully ` };
  }
}
