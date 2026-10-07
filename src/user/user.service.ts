import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity.js';
import { Model } from 'mongoose';
import { userDocument } from './schemas/user.schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  findById(id: string) {
    const user = this.userModel.findById(id);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.findByIdAndUpdate(id, updateUserDto);
    return `updated successfully`;
  }

  async updateRefreshToken(id: string, refreshTokenHash: string | null) {
    await this.userModel.findByIdAndUpdate(id, {refreshTokenHash});
  }

  remove(id: string) {
    this.userModel.findByIdAndDelete(id);
    return `deleted successfully`;
  }
}
