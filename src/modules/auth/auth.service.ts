import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    // Check if user.password exists
    if (!user.password) {
      throw new UnauthorizedException('User password not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iss: this.configService.get<string>('JWT_ISSUER'),
      aud: this.configService.get<string>('JWT_AUDIENCE'),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  //   async logout(_userId: number) {
  //     // In a real application, you might want to blacklist the token
  //     // For now, we'll just return a success message
  //     return { message: 'Logout successful' };
  //   }

  async refreshToken(userId: number) {
    const user = await this.userService.findById(userId);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iss: this.configService.get<string>('JWT_ISSUER'),
      aud: this.configService.get<string>('JWT_AUDIENCE'),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Token refreshed successfully',
      accessToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = await this.userService.findByEmail(forgotPasswordDto.email);

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Send an email with the reset link
      // 3. Store the token in database with expiration

      // For now, we'll just return a success message
      return {
        message:
          'If an account with that email exists, a password reset link has been sent',
      };
    } catch {
      // Don't reveal if the email exists or not for security reasons
      return {
        message:
          'If an account with that email exists, a password reset link has been sent',
      };
    }
  }

  //   async resetPassword(_resetPasswordDto: ResetPasswordDto) {
  //     // In a real application, you would:
  //     // 1. Validate the reset token
  //     // 2. Check if it's expired
  //     // 3. Find the user by token
  //     // 4. Update the password

  //     // For now, we'll throw an error
  //     throw new BadRequestException(
  //       'Reset password functionality not implemented yet',
  //     );
  //   }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(userId, changePasswordDto);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    return await this.userService.updateProfile(userId, updateProfileDto);
  }

  async getProfile(userId: number) {
    return await this.userService.getProfile(userId);
  }

  async validateToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
