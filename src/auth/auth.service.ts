import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './DTO/registerUser.dto.js';
import { loginUserDto } from './DTO/loginUser.dto.js';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterUserDto) {
    const { userName, email, password, confirmPassword }: RegisterUserDto = dto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new ConflictException(`User already exists !`);

    if (password !== confirmPassword) return `password doesn't match`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerData = {
      userName: userName,
      email: email,
      password: hashedPassword,
    };

    const user = await this.userService.create(registerData);

    return {
      message: `User created successFully !`,
      user: user,
    };
  }

  async login(dto: loginUserDto) {
    const { email, password }: loginUserDto = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException(`Invalid credentials !`);

    const isMatch = await bcrypt.compare(password, (user as any).password);

    if (!isMatch) throw new UnauthorizedException(`Invalid credentials !`);

    const tokens = await this.generateToken(
      (user as any).id,
      (user as any).email,
      (user as any).role
    );

    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);

    await this.userService.updateRefreshToken(
      (user as any).id,
      refreshTokenHash,
    );

    return tokens;
  }

  async generateToken(userId: string, email: string ,role : string) {
    const payload = {
      sub: userId,
      email,
      role
    };

    const accessToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = (await this.userService.findById(userId)) as any;

    if (!user || !user.refreshTokenHash)
      throw new UnauthorizedException(`invalid refresh token`);

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) throw new UnauthorizedException(`invalid refresh token`);

    const tokens = await this.generateToken(userId, user.email , user.role);

    const newRefreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);

    await this.userService.updateRefreshToken(userId, newRefreshTokenHash);
    return tokens;
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
    return {
      message: `Logged out successfully `,
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh Token');
    }
  }
}
