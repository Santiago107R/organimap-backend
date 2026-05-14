import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-user-auth.dto';
import { jwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto

      const user = this.userRespository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRespository.save(user)

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { name, password } = loginUserDto

    const user = await this.userRespository.findOne({
      where: { name },
      select: { name: true, password: true, id: true }
    })

    if (!user)
      throw new UnauthorizedException("Credentials are not valid (name or password)")

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException("Credentials are not valid (name or password")

    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  async checkAuthStatus(user) {

    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  private getJwtToken(payload: jwtPayload) {

    const token = this.jwtService.sign(payload)

    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')

  }
}
