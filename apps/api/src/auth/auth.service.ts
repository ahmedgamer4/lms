import { CreateTeacherDto, SelectTeacher } from '@lms-saas/shared-lib';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './types/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { Role } from './types/roles';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async validateLocalUser(email: string, password: string) {
    return this.validateLocalTeacher(email, password);
  }

  private async validateLocalTeacher(email: string, password: string) {
    const teacher = await this.usersService.findTeacherByEmail(email);
    if (!teacher) throw new UnauthorizedException('User not found!');
    const passwordMatched = await verify(teacher.passwordHash, password);
    if (!passwordMatched)
      throw new UnauthorizedException('Invalid credentials');

    return {
      id: teacher.teacherId,
      name: teacher.name,
      role: 'teacher',
      subdomain: teacher.subdomain,
    };
  }

  async login(userId: number, name: string, role: Role, subdomain?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      role,
    );

    const hashedRT = await hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(userId, role, hashedRT);

    return {
      id: userId,
      name: name,
      role,
      subdomain,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number, role: Role) {
    const payload: JwtPayload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async registerTeacher(dto: CreateTeacherDto) {
    const exists = await this.usersService.findTeacherByEmail(dto.email);
    if (exists) throw new ConflictException('Email already exists');
    return this.usersService.createTeacher(dto);
  }

  async validateJwtUser(userId: number, role: Role) {
    if (role === 'teacher') return this.validateJwtTeacher(userId);
    else return null;
  }

  async validateJwtTeacher(teacherId: number) {
    const user = await this.usersService.findTeacher(teacherId);
    if (!user) throw new UnauthorizedException('User not found!');

    const currentUser = {
      id: user.teacherId,
      name: user.name,
      role: 'teacher',
    };
    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string, role: Role) {
    let user: SelectTeacher | null;
    if (role === 'teacher')
      user = (await this.usersService.findTeacher(userId)) as SelectTeacher;
    else user = null;

    if (!user) throw new UnauthorizedException('User not found!');

    if (!refreshToken || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid refresh token!');

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid refresh token!');

    const currentUser = {
      id: user.teacherId,
      name: user.name,
      role,
    };
    return currentUser;
  }

  async refreshToken(userId: number, name: string, role: Role) {
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      role,
    );

    const hashedRT = await hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(userId, role, hashedRT);

    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: any, role: Role) {
    return await this.usersService.updateHashedRefreshToken(userId, role, null);
  }
}