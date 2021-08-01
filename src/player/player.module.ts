import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { PlayerController } from './player.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [PlayerController],
})
export class PlayerModule {}
