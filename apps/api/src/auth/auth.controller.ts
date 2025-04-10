import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateStudentDto,
  CreateTeacherDto,
  LoginUserDto,
} from '@lms-saas/shared-lib';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('teacher/register')
  registerTeacher(@Body() dto: CreateTeacherDto) {
    return this.authService.registerTeacher(dto);
  }

  @Public()
  @Post('student/register')
  registerStudent(@Body() dto: CreateStudentDto) {
    return this.authService.registerStudent(dto);
  }

  @Public()
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    const res = await this.authService.login(
      req.user.id,
      req.user.name,
      req.user.role,
      req.user.subdomain || null,
    );
    return res;
  }

  @ApiBearerAuth()
  @Public()
  @Roles('student', 'teacher')
  @ApiBody({ type: class schema {} })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(
      req.user.id,
      req.user.name,
      req.user.role,
    );
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req) {
    return this.authService.logout(req.user.id, req.user.role);
  }
}
