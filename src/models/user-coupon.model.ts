import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Coupon } from './coupon.model';

@Table
export class UserCoupon extends Model<UserCoupon> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isUsed: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  usedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Coupon)
  @Column({ type: DataType.INTEGER, allowNull: false })
  couponId: number;

  // Relations
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Coupon)
  coupon: Coupon;
}
