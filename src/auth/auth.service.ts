import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async register(user: User): Promise<User> {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async login(user: User): Promise<{
    access_token: string;
    userId: string;
    email: string;
    username: string;
  }> {
    const payload = { email: user.email, sub: user._id };
    const { username } = await this.userModel.findOne({ email: user.email });
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id,
      email: user.email,
      username: username,
    };
  }
}
