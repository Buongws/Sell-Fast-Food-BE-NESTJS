import { StringRequired } from '@/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @StringRequired('Email')
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassw0rd!' })
  @StringRequired('Password')
  @MinLength(8)
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @StringRequired('Name')
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @ApiProperty({ example: '0912345678', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
