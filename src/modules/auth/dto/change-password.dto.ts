import { ApiProperty } from '@nestjs/swagger';
import { StringRequired } from '@/common/decorators';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassw0rd!' })
  @StringRequired('Current Password')
  currentPassword: string;

  @ApiProperty({ example: 'NewPassw0rd!' })
  @StringRequired('New Password')
  @MinLength(8)
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword: string;
}
