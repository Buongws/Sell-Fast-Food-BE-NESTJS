import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordResetToken } from '@/models/password-reset-token.model';
import { MailService } from './mail.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    SequelizeModule.forFeature([PasswordResetToken]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: (() => {
          const service = config.get<string>('SMTP_SERVICE');
          if (service) {
            return {
              service,
              auth: {
                user: config.get<string>('SMTP_USER'),
                pass: config.get<string>('SMTP_PASS'),
              },
            };
          }

          const host = config.get<string>('SMTP_HOST');
          if (!host || host.includes('@')) {
            throw new Error(
              'Invalid SMTP_HOST. Please set SMTP_HOST to your SMTP server host (e.g., smtp.gmail.com), not an email address.',
            );
          }

          return {
            host,
            port: Number(config.get<string>('SMTP_PORT') ?? '587'),
            secure: config.get<string>('SMTP_SECURE') === 'true',
            auth: {
              user: config.get<string>('SMTP_USER'),
              pass: config.get<string>('SMTP_PASS'),
            },
          };
        })(),
        defaults: {
          from: config.get<string>('MAIL_FROM') || 'no-reply@example.com',
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}
