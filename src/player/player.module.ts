import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayerController } from './player.controller';
import { AwsModule } from 'src/aws/aws.module';
import { PlayerService } from './player.service';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
