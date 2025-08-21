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
import { OrderItem } from './order-item.model';
import { Ingredient } from './ingredient.model';

@Table
export class OrderItemIngredient extends Model<OrderItemIngredient> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => OrderItem)
  @Column({ type: DataType.INTEGER, allowNull: false })
  orderItemId: number;

  @ForeignKey(() => Ingredient)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ingredientId: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  quantity: number;

  // Relations
  @BelongsTo(() => OrderItem)
  orderItem: OrderItem;

  @BelongsTo(() => Ingredient)
  ingredient: Ingredient;
}
