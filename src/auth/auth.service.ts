import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Raw, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-user-auth.dto';
import { jwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-auth.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleDbError } from '../common/utils/handle-errors';
import { UpdateAuthDto } from './dto/update-user-auth.dto';

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
      handleDbError(error)
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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, query = undefined, roles = undefined } = paginationDto;

    const queryBuilder = this.userRespository.createQueryBuilder('user')
      .leftJoinAndSelect('user.docenteAula', 'docenteAula')
      .take(limit)
      .skip(offset);

    if (query !== undefined) {
      queryBuilder.andWhere('user.name ILike :query', { query: `%${query}%` });
    }

    if (roles && roles.length > 0) {
      const cleanRoles = roles.map(role => role.trim());

      queryBuilder.andWhere('user.roles @> :cleanRoles::text[]', { cleanRoles });
    }

    try {
      const [users, total] = await queryBuilder.getManyAndCount();
      const pages = limit > 0 ? Math.ceil(total / limit) : 0;

      return {
        total,
        pages,
        users,
      };
    } catch (error) {
      handleDbError(error);
    }
  }

  async findOne(id: string) {
    const user = await this.userRespository.findOne({
      where: { id },
      relations: {
        docenteAula: true,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`)

    return user
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const user = await this.userRespository.preload({
      id,
      ...updateAuthDto,
    })

    if (!user) throw new NotFoundException(`User with id ${id} not found`)

    try {
      await this.userRespository.save(user);

      return this.findOne(id);
    } catch (error) {
      handleDbError(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    await this.userRespository.remove(user)

    return `DELETE HAS BEEN SUCCESSFUL`;
  }

}
