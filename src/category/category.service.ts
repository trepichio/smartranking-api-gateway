import { Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { createCategoryDTO } from './dtos/createCategory.dto';
import { updateCategoryDTO } from './dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyInstance('admin');

  createCategory(dto: createCategoryDTO) {
    this.clientAdminBackend.emit('create-category', dto);
  }

  async getCategories(_id: string = ''): Promise<any> {
    return await this.clientAdminBackend
      .send('get-categories', _id)
      .toPromise();
  }

  updateCategory(id: string, dto: updateCategoryDTO) {
    this.clientAdminBackend.emit('update-category', { id, dto });
  }

  deleteCategory(id: string) {
    this.clientAdminBackend.emit('delete-category', { id });
  }
}
