import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './utils/local-auth.guard';
import { User } from '../users/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
  ): Promise<{ access_token: string; userId: string; email: string }> {
    try {
      const { access_token, userId, email } = await this.authService.login(
        req.body,
      );
      return { access_token, userId, email };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Request() req): Promise<{
    access_token: string;
    userId: string;
    email: string;
    username: string;
  }> {
    try {
      const { access_token, userId, email, username } =
        await this.authService.register(req.body);
      return { access_token, userId, email, username };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('validateUser')
  async validateUser(@Request() req): Promise<User | null> {
    try {
      const { email, password } = req.body;
      return await this.authService.validateUser(email, password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('validateUserByToken')
  async validateUserByToken(@Request() req): Promise<User | null> {
    try {
      const { token } = req.body;
      return await this.authService.validateUserByToken(token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
