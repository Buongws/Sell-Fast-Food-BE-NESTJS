import { ApiProperty } from '@nestjs/swagger';
import { StringRequired } from '@/common/decorators';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @StringRequired('Email')
  @IsEmail()
  email: string;
}
