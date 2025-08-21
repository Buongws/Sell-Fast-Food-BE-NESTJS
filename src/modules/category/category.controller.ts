import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Category already exists',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Slug have been taken',
  })
  @Post('create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
  })
  @Get('all')
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })
  @Patch('update/:id')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Category fetched successfully',
  })
  @Get(':id')
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOneCategory(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  @Delete('delete/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
