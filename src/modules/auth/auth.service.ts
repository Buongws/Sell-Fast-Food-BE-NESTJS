import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { PasswordResetToken } from '@/models/password-reset-token.model';
import { Op } from 'sequelize';
import { randomBytes } from 'crypto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    context?: { ip?: string; userAgent?: string },
  ) {
    const genericMessage = {
      message:
        'If an account with that email exists, a password reset link has been sent',
    } as const;

    const { email } = forgotPasswordDto;
    let user: { id: number; email: string } | null = null;
    try {
      user = await this.userService.findByEmail(email);
    } catch {
      // Do not reveal user existence; proceed as if success
      return genericMessage;
    }

    const ip = context?.ip ?? null;
    const userAgent = context?.userAgent ?? null;

    // Throttle resend: if there is an unexpired unused token created recently, do not create another
    const now = new Date();
    const throttleWindowMinutes = Number(
      this.configService.get<string>('RESET_THROTTLE_MINUTES') ?? '2',
    );
    const throttleSince = new Date(
      now.getTime() - throttleWindowMinutes * 60 * 1000,
    );

    const existingRecent = await PasswordResetToken.findOne({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { [Op.gt]: now },
        createdAt: { [Op.gte]: throttleSince },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!existingRecent) {
      const tokenBytes = randomBytes(32); // 32 bytes -> 256 bits
      const rawToken = tokenBytes.toString('base64url');
      const tokenHash = await bcrypt.hash(rawToken, 10);

      const ttlMinutes = Number(
        this.configService.get<string>('RESET_TOKEN_TTL_MINUTES') ?? '20',
      );
      const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

      await PasswordResetToken.create({
        userId: user.id,
        tokenHash,
        expiresAt,
        usedAt: null,
        createdIp: ip,
        createdUserAgent: userAgent,
      });

      // Gửi email chứa rawToken (không lưu clear text trong DB)
      await this.mailService.sendPasswordResetEmail(user.email, rawToken);
    }

    return genericMessage;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const now = new Date();

    // Find all valid tokens and check for a match in constant time via bcrypt
    const candidates = await PasswordResetToken.findAll({
      where: {
        usedAt: null,
        expiresAt: { [Op.gt]: now },
      },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });

    let matched: PasswordResetToken | null = null;
    for (const t of candidates) {
      // eslint-disable-next-line no-await-in-loop
      const ok = await bcrypt.compare(token, t.tokenHash);
      if (ok) {
        matched = t;
        break;
      }
    }

    if (!matched) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    await this.userService.updatePasswordById(matched.userId, newPassword);

    matched.usedAt = now;
    await matched.save();

    // Optional: rotate refresh sessions by bumping tokenVersion (if implemented)
    // await this.userService.bumpTokenVersion(candidate.userId);

    return {
      message: 'Password has been reset successfully',
    };
  }

  async validateResetToken(token: string) {
    const now = new Date();
    const candidates = await PasswordResetToken.findAll({
      where: { usedAt: null, expiresAt: { [Op.gt]: now } },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    for (const t of candidates) {
      // eslint-disable-next-line no-await-in-loop
      const ok = await bcrypt.compare(token, t.tokenHash);
      if (ok) {
        return { valid: true };
      }
    }
    return { valid: false };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(userId, changePasswordDto);
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
