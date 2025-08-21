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
import { Product } from './product.model';
import { Ingredient } from './ingredient.model';

@Table
export class ProductIngredient extends Model<ProductIngredient> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @ForeignKey(() => Ingredient)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ingredientId: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isDefault: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  quantity: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Ingredient)
  ingredient: Ingredient;
}
