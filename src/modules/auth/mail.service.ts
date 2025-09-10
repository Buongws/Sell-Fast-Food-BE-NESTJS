import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(params: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    fromOverride?: string;
  }) {
    const from =
      params.fromOverride ||
      this.configService.get<string>('MAIL_FROM') ||
      'no-reply@example.com';
    await this.mailerService.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const mode = (
      this.configService.get<string>('PASSWORD_RESET_LINK_TARGET') || 'api'
    ).toLowerCase();
    let resetUrl: string;
    if (mode === 'frontend') {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:5173';
      resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(
        token,
      )}`;
    } else {
      const appUrl =
        this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      const apiPrefix =
        this.configService.get<string>('API_PREFIX') || 'api/v1';
      const base = `${appUrl.replace(/\/$/, '')}/${apiPrefix.replace(/\/$/, '')}`;
      resetUrl = `${base}/auth/validate-reset-token?token=${encodeURIComponent(
        token,
      )}`;
    }
    const subject = 'Đặt lại mật khẩu của bạn';
    const text = `Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết sau để tiếp tục: ${resetUrl}`;
    const html = `
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Nhấp vào liên kết sau để đặt lại mật khẩu (liên kết có hiệu lực trong thời gian ngắn):</p>
      <p><a href="${resetUrl}">Đặt lại mật khẩu</a></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `;
    await this.sendMail({ to, subject, text, html });
  }
}
