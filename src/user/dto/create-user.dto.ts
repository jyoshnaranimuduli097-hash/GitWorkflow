import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName: string;

  
  @IsString()
  @IsEmail()
  email: string;


  @IsString()
  password: string;

}
