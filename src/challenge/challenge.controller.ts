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
import { createChallengeDTO } from './dtos/create-challenge.dto';
import { ChallengeInterface } from './interfaces/challenge.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { PlayerInterface } from 'src/player/interfaces/player.interface';

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

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createChallenge(
    @Body() dto: createChallengeDTO,
  ): Promise<ChallengeInterface> {
    this.logger.log(`createChallengeDTO: ${JSON.stringify(dto)}`);

    const { requester, players, category } = dto;

    let playersFound: PlayerInterface[] = [];

    /**
     * Check if category is valid
     */
    const categoryFound = await this.clientAdminBackend
      .send('get-categories', category)
      .toPromise();

    if (!categoryFound) {
      throw new BadRequestException(`Category ${category} not found`);
    }

    /**
     * Check if players exist on database
     */
    for (const { _id } of players) {
      playersFound = [
        ...playersFound,
        await this.clientAdminBackend.send('get-players', _id).toPromise(),
      ];
    }

    if (playersFound.length !== players.length) {
      throw new BadRequestException('Some players not found');
    }

    /**
     * Check if players are registered in provided Category
     */
    if (playersFound.some((player) => player.category !== category)) {
      throw new BadRequestException(
        `All players must be registered in the provided category ${category}`,
      );
    }

    /**
     * Check if requester is one of the match's players
     */
    if (!players.find((p) => p._id === requester)) {
      throw new BadRequestException(
        'The requester player is not included in the challenge',
      );
    }

    /**
     * and create the challenge!
     */
    return await this.clientChallenges
      .emit('create-challenge', dto)
      .toPromise();
  }
}
