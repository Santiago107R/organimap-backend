import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { GetUser } from './decorators';
import { User } from './entities/user.entity';
import { type Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async createUser(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    const { token, ...user } = await this.authService.create(createAuthDto)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.STAGE === 'prod',
      sameSite: 'lax',
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return {
      ...user,
      token,
    };
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const { token, ...user } = await this.authService.login(loginUserDto)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.STAGE === 'prod',
      sameSite: 'lax',
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return {
      ...user,
      token,
    };
  }

  @Get('check-status')
  @UseGuards(AuthGuard())
  async checkAuthStatus(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, ...userToReturn } = await this.authService.checkAuthStatus(user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.STAGE === 'prod',
      sameSite: 'lax',
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    return {
      ...userToReturn,
      token,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Sesión cerrada correctamente' };
  }

}
