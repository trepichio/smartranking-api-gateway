import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { CategoryController } from './category.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
