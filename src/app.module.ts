import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [ConfigModule.forRoot(), CategoryModule, PlayerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
