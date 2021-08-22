import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Logger,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ChallengeInterface } from './interfaces/challenge.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly clientChallenges =
    this.clientProxySmartRanking.getClientProxyInstance('challenges');

  private readonly clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyInstance('admin');

  private readonly logger = new Logger(ChallengeController.name);

  @Get(':challengeId?')
  async getChallenges(
    @Param('challengeId') challengeId: string = '',
    @Query('playerId') playerId: string = '',
  ): Promise<ChallengeInterface[]> {
    if (!challengeId && playerId) {
      /**
       * Check if playerId is valid
       */
      const player = await this.clientAdminBackend
        .send('get-players', playerId)
        .toPromise();

      if (!player) {
        throw new BadRequestException(`Player with id ${playerId} not found`);
      }
    }

    /**
     * Get Challenges (all or by playerId or by challengeId)
     */
    return await this.clientChallenges
      .send('get-challenges', { playerId, challengeId })
      .toPromise();
  }

}
