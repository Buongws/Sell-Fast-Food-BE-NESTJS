import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  BeforeValidate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { Ingredient } from './ingredient.model';
import { makeSlugFromString } from '@/utils/index';

@Table
export class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  sortOrder: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  //Relations
  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Ingredient)
  ingredients: Ingredient[];

  @BeforeValidate
  static makeSlug(newCategory: Category) {
    const name = newCategory.dataValues.name;
    console.log({ name });
    if (name) {
      const slug = makeSlugFromString(name);
      newCategory.setDataValue('slug', slug);
    }
  }
  @BeforeUpdate
  static updateSlug(category: Category) {
    if (category.changed('name')) {
      const name = category.dataValues.name;
      const slug = makeSlugFromString(name);
      category.setDataValue('slug', slug);
    }
  }
}
