import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import {  ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true,}),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async(configService : ConfigService)=>({
        uri:configService.get<string>('MONGODB_URI')
      })
    }),
    PassportModule,
    UserModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
