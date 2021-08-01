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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { createCategoryDTO } from './dtos/createCategory.dto';
import { updateCategoryDTO } from './dtos/updateCategory.dto';

@Controller('api/v1/categories')
export class CategoryController {
  private logger = new Logger(CategoryController.name);

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createCategory(@Body() dto: createCategoryDTO) {
    return this.clientAdminBackend.emit('create-category', dto);
  }

  @Get()
  getCategories(@Query('categoryId') _id = '') {
    return this.clientAdminBackend.send('get-categories', _id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateCategory(@Body() dto: updateCategoryDTO, @Param('id') id) {
    return this.clientAdminBackend.emit('update-category', { id, dto });
  }

  @Delete(':id')
  deleteCategory(@Param('id') id) {
    return this.clientAdminBackend.emit('delete-category', { id });
  }
}
