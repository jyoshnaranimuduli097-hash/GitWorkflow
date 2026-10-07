import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UserModule } from '../user/user.module.js';

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'access-token',
    }),

    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async(configService:ConfigService)=>({
        secret:configService.get<string>('ACCESS_SECRET'),
        signOptions: { expiresIn : '1d'}
      })

    }),

    UserModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    PassportModule,
    AuthService,
  ],
})
export class AuthModule {}