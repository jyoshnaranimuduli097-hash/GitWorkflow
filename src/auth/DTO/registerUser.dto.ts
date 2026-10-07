import { IsString, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
  @IsString()
  confirmPassword: string;

}
