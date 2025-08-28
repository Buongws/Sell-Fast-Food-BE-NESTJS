import { StringRequired } from '@/common/decorators';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @StringRequired('Email')
  @IsEmail()
  email: string;
}
