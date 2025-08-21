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
import { Cart } from './carts.model';
import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';
import { CartItemIngredient } from './cart-item-ingredient.model';

@Table
export class CartItem extends Model<CartItem> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  quantity: number;

  @ForeignKey(() => Cart)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cartId: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @ForeignKey(() => ProductVariant)
  @Column({ type: DataType.INTEGER, allowNull: true })
  variantId: number;

  // Relations
  @BelongsTo(() => Cart)
  cart: Cart;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => ProductVariant)
  variant: ProductVariant;

  @HasMany(() => CartItemIngredient)
  cartItemIngredients: CartItemIngredient[];
}
