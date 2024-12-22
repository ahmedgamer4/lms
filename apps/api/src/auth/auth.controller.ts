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
import { CreateTeacherDto, LoginTeacherDto } from '@lms-saas/shared-lib';
import { ApiBody } from '@nestjs/swagger';
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
  @ApiBody({ type: LoginTeacherDto })
  @Post('teacher/login')
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

  @Roles('student', 'teacher')
  @ApiBody({ type: class schema {} })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req, @Body() body: any) {
    console.log(req.user);
    return this.authService.refreshToken(req.user.id, req.user.name, body.role);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req) {
    return this.authService.logout(req.user.id, req.user.role);
  }
}
