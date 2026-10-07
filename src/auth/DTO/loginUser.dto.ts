import { IsString, IsEmail, IsInt } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}