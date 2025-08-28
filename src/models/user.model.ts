import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum';
import { Address } from './address.model';
import { Order } from './order.model';
import { Cart } from './carts.model';
import { UserCoupon } from './user-coupon.model';
import { Review } from './review.model';
import * as bcrypt from 'bcryptjs';

export interface UserCreationAttributes {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  phone?: string;
  role?: UserRole;
  provider?: string;
}

@Table
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ type: DataType.STRING, allowNull: true })
  provider: string;

  // Relations
  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => Order)
  orders: Order[];

  @HasOne(() => Cart)
  cart: Cart;

  @HasMany(() => UserCoupon)
  userCoupons: UserCoupon[];

  @HasMany(() => Review)
  reviews: Review[];

  async comparePassword(password: string) {
    const hashedPassword = this.getDataValue('password');
    return await bcrypt.compare(password, hashedPassword);
  }
}
