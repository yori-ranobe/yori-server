import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Password did not match');
    }
    return user;
  }

  async validateUserByToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async register(user: User): Promise<{
    access_token: string;
    userId: string;
    email: string;
    username: string;
  }> {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    await createdUser.save();

    const payload = { email: createdUser.email, sub: createdUser._id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      userId: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
    };
  }

  async login(userData: User): Promise<{
    access_token: string;
    userId: string;
    email: string;
    username: string;
  }> {
    const user = await this.validateUser(userData.email, userData.password);
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id,
      email: user.email,
      username: user.username,
    };
  }
}
