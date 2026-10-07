import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/enum/role.enum.js';

export type userDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  userName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.User,
  })
  role: string;

  @Prop({
    type: String,
    default: null,
  })
  refreshTokenHash: string | null;
}

export const userSchema = SchemaFactory.createForClass(User);
