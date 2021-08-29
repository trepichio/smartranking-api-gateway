import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { addMatchToChallengeDTO } from 'src/challenge/dtos/add-match-to-challenge.dto';
import { IPlayer } from 'src/player/interfaces/player.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { createChallengeDTO } from './dtos/create-challenge.dto';
import { updateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { IChallenge } from './interfaces/challenge.interface';
import { IMatch } from './interfaces/match.interface';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly clientChallenges =
    this.clientProxySmartRanking.getClientProxyInstance('challenges');

  private readonly clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyInstance('admin');

  private readonly logger = new Logger(ChallengeService.name);

  async getChallenges(
    challengeId: string = '',
    playerId: string = '',
  ): Promise<IChallenge[]> {
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

  async createChallenge(dto: createChallengeDTO): Promise<any> {
    this.logger.log(`createChallengeDTO: ${JSON.stringify(dto, null, 2)}`);

    const { requester, players, category } = dto;

    let playersFound: IPlayer[] = [];

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
    await this.clientChallenges.emit('create-challenge', dto).toPromise();
  }

  async updateChallenge(
    challengeId: string,
    dto: updateChallengeDTO,
  ): Promise<void> {
    this.logger.log(`updateChallengeDTO: ${JSON.stringify(dto, null, 2)}`);

    /**
     * Check if challengeId is valid
     */
    const challengeFound = await this.clientChallenges
      .send('get-challenges', { challengeId })
      .toPromise();

    if (!challengeFound) {
      throw new BadRequestException(
        `Challenge with id ${challengeId} not found`,
      );
    }

    /**
     * Check if challenge status is PENDING
     */
    if (challengeFound.status !== ChallengeStatus.PENDING) {
      throw new BadRequestException(
        `Challenge with ${challengeId} is not PENDING, it is ${challengeFound.status} and cannot be updated.`,
      );
    }

    /**
     * and update the challenge
     */
    this.clientChallenges.emit('update-challenge', {
      challengeId,
      dto,
    });
  }

  async deleteOne(challengeId: string): Promise<void> {
    /**
     * Check if challengeId is valid
     */
    const challengeFound = await this.clientChallenges
      .send('get-challenges', { challengeId })
      .toPromise();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge with ${challengeId} not found`);
    }

    /**
     * and delete the challenge
     */
    this.clientChallenges.emit('delete-challenge', challengeId);
  }

  async addMatch(
    challengeId: string,
    dto: addMatchToChallengeDTO,
  ): Promise<void> {
    this.logger.log(`addMatchToChallengeDTO: ${JSON.stringify(dto, null, 2)}`);

    /**
     * Check if challengeId is valid
     */
    const challengeFound = await this.clientChallenges
      .send('get-challenges', { challengeId })
      .toPromise();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge with ${challengeId} not found`);
    }

    /**
     * Check if challenge status is FINISHED and refuse to update the challenge
     */
    if (challengeFound.status === ChallengeStatus.FINISHED) {
      throw new BadRequestException(
        `Challenge with ${challengeId} is already FINISHED!
        This challenge cannot be updated anymore.`,
      );
    }

    /**
     * Check if challenge status is not ACCEPTED and refuse to update the challenge
     */
    if (challengeFound.status !== ChallengeStatus.ACCEPTED) {
      throw new BadRequestException(
        `Only challenges which are ACCEPTED can add a match`,
      );
    }

    /**
     * Check if winner is really one of the players of the challenge
     */
    if (!challengeFound.players.find((playerId) => playerId === dto.winner)) {
      throw new BadRequestException(
        `The winner player ${dto.winner} is not included in the challenge ${challengeId}`,
      );
    }

    /**
     * then add category, players and this challenge to the match DTO
     */
    const match: IMatch = {
      category: challengeFound.category,
      winner: dto.winner,
      result: dto.result,
      players: challengeFound.players,
      challenge: challengeId,
    };

    /**
     * and then it can create a match and add it to the challenge
     */
    this.clientChallenges.emit('create-match', match);
  }
}
