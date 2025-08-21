import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { User } from '@/models';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductVariant } from '@/models/product-variant.model';
import { ProductIngredient } from '@/models/product-ingredient.model';
import { Ingredient } from '@/models/ingredient.model';
import { Order } from '@/models/order.model';
import { OrderItem } from '@/models/order-item.model';
import { OrderItemIngredient } from '@/models/order-item-ingredient.model';
import { Cart } from '@/models/carts.model';
import { CartItem } from '@/models/cart-item.model';
import { Review } from '@/models/review.model';
import { UserCoupon } from '@/models/user-coupon.model';
import { Address } from '@/models/address.model';
import { CartItemIngredient } from '@/models/cart-item-ingredient.model';
import { Coupon } from '@/models/coupon.model';

export const getSequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: configService.get<Dialect>('DB_DIALECT') ?? 'postgres',
  database: configService.get<string>('DB_NAME'),
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  autoLoadModels: true,
  synchronize: true,
  logging: false,
  models: [
    User,
    Category,
    Product,
    ProductVariant,
    ProductIngredient,
    Ingredient,
    Order,
    OrderItem,
    OrderItemIngredient,
    Cart,
    CartItem,
    Review,
    UserCoupon,
    Address,
    CartItemIngredient,
    Coupon,
  ],
});
