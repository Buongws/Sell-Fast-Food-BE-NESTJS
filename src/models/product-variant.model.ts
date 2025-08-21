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
import { Product } from './product.model';
import { ProductSize } from './enums/product-size.enum';
import { ProductType } from './enums/product-type.enum';
import { OrderItem } from './order-item.model';
import { CartItem } from './cart-item.model';

@Table
export class ProductVariant extends Model<ProductVariant> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProductSize)),
    allowNull: false,
    defaultValue: ProductSize.SMALL,
  })
  size: ProductSize;

  @Column({
    type: DataType.ENUM(...Object.values(ProductType)),
    allowNull: false,
    defaultValue: ProductType.THIN,
  })
  type: ProductType;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  modifiedPrice: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @HasMany(() => CartItem)
  cartItems: CartItem[];
}
