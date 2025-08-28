import { StringRequired } from '@/common/decorators';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
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
}
