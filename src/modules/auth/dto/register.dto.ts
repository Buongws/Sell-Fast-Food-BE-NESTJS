import { StringRequired } from '@/common/decorators';
import {
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @StringRequired('Email')
  @IsEmail()
  email: string;

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

  @StringRequired('Name')
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
