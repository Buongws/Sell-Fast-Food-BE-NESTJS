import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { CouponType } from './enums/coupon-type.enum';
import { UserCoupon } from './user-coupon.model';

@Table
export class Coupon extends Model<Coupon> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(CouponType)),
    allowNull: false,
  })
  type: CouponType;

  @Column({ type: DataType.INTEGER, allowNull: false })
  value: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  minOrderAmount: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  maxUses: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  currentUses: number;

  @Column({ type: DataType.DATE, allowNull: false })
  validFrom: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  validTo: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  // Relations
  @HasMany(() => UserCoupon)
  userCoupons: UserCoupon[];
}
