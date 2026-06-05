import { Controller, Get, Post, Body, Res, UseGuards, Query, Param, ParseUUIDPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { type Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { UpdateAuthDto } from './dto/update-user-auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidRoles } from './interfaces';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User was created', type: () => User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Authenticated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Sesión cerrada correctamente' };
  }

  @Get('user')
  @Auth(ValidRoles.admin, ValidRoles.secretario)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  @Get('user/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Patch('user/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(@Param('id', ParseUUIDPipe) id: string, updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('user/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }

}
