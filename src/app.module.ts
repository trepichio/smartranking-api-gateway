import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ConfigModule.forRoot(), CategoryModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
