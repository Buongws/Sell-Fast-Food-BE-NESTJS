import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Address } from './address.model';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';
import { OrderItem } from './order-item.model';
import { Review } from './review.model';

@Table
export class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  orderNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: true,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: DataType.INTEGER, allowNull: true })
  subTotal: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deliveryFee: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  discount: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  total: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;

  // Relations

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Address)
  @Column({ type: DataType.INTEGER, allowNull: false })
  addressId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Address)
  address: Address;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @HasMany(() => Review)
  reviews: Review[];
}
