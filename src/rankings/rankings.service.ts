import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';

@Injectable()
export class RankingsService {
  private readonly logger = new Logger(RankingsService.name);

  constructor(
    private readonly clientSmartRankingProxy: ClientProxySmartRanking,
  ) {}

  private readonly clientRankings: ClientProxy =
    this.clientSmartRankingProxy.getClientProxyInstance('rankings');

  async getRankings(categoryId: string, dateRef: string = ''): Promise<any> {
    this.logger.log(`get Rankings of ${categoryId} at date: ${dateRef})`);

    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    return await this.clientRankings
      .send('get-rankings', { categoryId, dateRef })
      .toPromise();
  }
}
