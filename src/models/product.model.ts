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
import { Category } from './category.model';
import { OrderItem } from './order-item.model';
import { ProductVariant } from './product-variant.model';
import { ProductIngredient } from './product-ingredient.model';
import { Review } from './review.model';
import { CartItem } from './cart-item.model';

@Table
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  basePrice: number;

  @Column({ type: DataType.STRING, allowNull: false })
  imageUrl: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isFeatured: boolean;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  // Relations
  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @HasMany(() => ProductVariant)
  variants: ProductVariant[];

  @HasMany(() => ProductIngredient)
  ingredients: ProductIngredient[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => CartItem)
  cartItems: CartItem[];
}
