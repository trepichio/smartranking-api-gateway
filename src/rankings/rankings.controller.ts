import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';

@Controller('api/v1/rankings')
export class RankingsController {
  private readonly logger = new Logger(RankingsController.name);

  constructor(
    private readonly clientSmartRankingProxy: ClientProxySmartRanking,
  ) {}

  private readonly clientRankings: ClientProxy =
    this.clientSmartRankingProxy.getClientProxyInstance('rankings');

  @Get()
  getRankings(
    @Query('categoryId') categoryId: string,
    @Query('dateRef') dateRef: string = '',
  ): Observable<any> {
    this.logger.log(`get Rankings of ${categoryId} at date: ${dateRef})`);

    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    return this.clientRankings.send('get-rankings', { categoryId, dateRef });
  }
}
