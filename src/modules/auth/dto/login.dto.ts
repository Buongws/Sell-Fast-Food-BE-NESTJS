import { StringRequired } from '@/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @StringRequired('Email')
  email: string;

  @ApiProperty({ example: 'StrongPassw0rd!' })
  @StringRequired('Password')
  password: string;
}
