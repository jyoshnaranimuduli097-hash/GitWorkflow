import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
import { IsString, IsEmail } from 'class-validator';
import { Role } from '../../common/enum/role.enum.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  userName?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  role?: Role;
}
