import { Body, Controller, Get, Put, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/models/enums/user-role.enum';

interface RequestWithUser {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return await this.userService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @Put('change-password')
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }

  // Admin only endpoints
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    // This would be implemented in UserService
    return { message: 'Get all users - Admin only' };
  }
}
