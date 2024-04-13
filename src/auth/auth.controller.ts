import { Controller, Post, Request, UseGuards } from '@nestjs/common';
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
    const { access_token, userId, email } = await this.authService.login(
      req.user,
    );
    return { access_token, userId, email };
  }

  @Post('register')
  async register(@Request() req): Promise<User> {
    return this.authService.register(req.body);
  }

  @Post('validateUser')
  async validateUser(@Request() req): Promise<User | null> {
    const { email, password } = req.body;
    return this.authService.validateUser(email, password);
  }
}
