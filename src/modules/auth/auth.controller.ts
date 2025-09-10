import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { UserRole } from '@/models/enums/user-role.enum';

interface RequestWithUser {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.OK)
  // async logout(@Request() req: RequestWithUser) {
  //   return await this.authService.logout(req.user.id);
  // }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req: RequestWithUser) {
    return await this.authService.refreshToken(req.user.id);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Req() req: ExpressRequest,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.ip ||
      (req.socket && req.socket.remoteAddress) ||
      undefined;
    const userAgent = (req.headers['user-agent'] as string) || undefined;
    return await this.authService.forgotPassword(forgotPasswordDto, {
      ip,
      userAgent,
    });
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Get('validate-reset-token')
  @HttpCode(HttpStatus.OK)
  async validateResetToken(@Query('token') token: string) {
    // Tái sử dụng logic so khớp hash, nhưng không đổi mật khẩu
    const result = await this.authService.validateResetToken(token);
    return result;
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }

  // Admin only endpoints
  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  getAllUsers() {
    // This would be implemented in UserService
    return { message: 'Admin endpoint - get all users' };
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  getAdminStats() {
    // This would be implemented in a separate service
    return { message: 'Admin endpoint - get statistics' };
  }
}
