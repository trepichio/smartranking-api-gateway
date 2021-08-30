import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { AwsModule } from './aws/aws.module';
import { ChallengeModule } from './challenge/challenge.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    CategoryModule,
    PlayerModule,
    AwsModule,
    ChallengeModule,
    RankingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
