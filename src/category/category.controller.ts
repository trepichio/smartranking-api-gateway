import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDTO } from './dtos/createCategory.dto';
import { updateCategoryDTO } from './dtos/updateCategory.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/categories')
export class CategoryController {
  private logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createCategory(@Body() dto: createCategoryDTO) {
    this.categoryService.createCategory(dto);
  }

  @Get()
  async getCategories(@Query('categoryId') _id: string = ''): Promise<any> {
    return await this.categoryService.getCategories(_id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateCategory(@Body() dto: updateCategoryDTO, @Param('id') id: string) {
    this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    this.categoryService.deleteCategory(id);
  }
}
