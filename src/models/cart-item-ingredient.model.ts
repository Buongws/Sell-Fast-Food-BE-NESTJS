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
import { CartItem } from './cart-item.model';
import { Ingredient } from './ingredient.model';

@Table
export class CartItemIngredient extends Model<CartItemIngredient> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => CartItem)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cartItemId: number;

  @ForeignKey(() => Ingredient)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ingredientId: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  quantity: number;

  // Relations
  @BelongsTo(() => CartItem)
  cartItem: CartItem;

  @BelongsTo(() => Ingredient)
  ingredient: Ingredient;
}
