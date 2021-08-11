import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayerController } from './player.controller';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [PlayerController],
})
export class PlayerModule {}
