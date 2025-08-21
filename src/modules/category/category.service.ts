import { Category } from '@/models/category.model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CATEGORY_ERRORS } from './dto/constant-error.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { makeSlugFromString } from '../../utils/helpers';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const alreadyExists = await this.categoryModel.findOne({
      where: {
        slug: makeSlugFromString(createCategoryDto.name),
      },
    });
    if (alreadyExists) {
      throw new BadRequestException(CATEGORY_ERRORS.CATEGORY_ALREADY_EXISTS);
    }
    await this.categoryModel.create({
      ...createCategoryDto,
    } as Category);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const alreadyExists = await this.categoryModel.findByPk(id);
    if (!alreadyExists) {
      throw new NotFoundException('Category not found');
    }
    const updated = await alreadyExists.update(updateCategoryDto);

    return {
      message: 'Category updated successfully',
      data: updated,
    };
  }

  async deleteCategory(id: number) {
    await this.categoryModel.destroy({ where: { id }, cascade: true });
    return {
      message: 'Category deleted successfully',
    };
  }

  async findOneCategory(id: number): Promise<Category | null> {
    return this.categoryModel.findOne({ where: { id } });
  }
}
