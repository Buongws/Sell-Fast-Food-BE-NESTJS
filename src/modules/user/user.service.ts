import { User } from '@/models';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      raw: true, // Get raw data from database
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      raw: true, // Get raw data from database
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async register(params: CreateUserDto) {
    const alreadyExist = await this.userModel.findOne({
      where: { email: params.email },
      raw: true,
    });
    if (alreadyExist) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);

    await this.userModel.create({
      ...params,
      password: hashedPassword,
    });

    return { message: 'User created successfully' };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    // Sử dụng User.update() thay vì user.update() vì user là raw object
    await this.userModel.update(updateProfileDto, { where: { id: userId } });

    // Lấy user đã update để trả về
    const updatedUser = await this.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return { message: 'Profile updated successfully', user: result };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.findById(userId);

    // Kiểm tra xem user.password có tồn tại không
    if (!user.password) {
      throw new BadRequestException('User password not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const saltRounds =
      Number(this.configService.get('BCRYPT_SALT_ROUNDS')) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    // Sử dụng User.update() thay vì user.update() vì user là raw object
    await this.userModel.update(
      { password: hashedNewPassword },
      { where: { id: userId } },
    );

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.dataValues;
    return result;
  }
}
