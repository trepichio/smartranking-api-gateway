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
  UseGuards,
} from '@nestjs/common';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params';
import { addMatchToChallengeDTO } from 'src/challenge/dtos/add-match-to-challenge.dto';
import { createChallengeDTO } from './dtos/create-challenge.dto';
import { updateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeService } from './challenge.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Get(':challengeId?')
  async getChallenges(
    @Param('challengeId') challengeId: string = '',
    @Query('playerId') playerId: string = '',
  ): Promise<any> {
    return await this.challengeService.getChallenges(challengeId, playerId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createChallenge(@Body() dto: createChallengeDTO) {
    await this.challengeService.createChallenge(dto);
  }

  @Put(':challengeId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateChallenge(
    @Param('challengeId', ValidationParamsPipe) challengeId: string,
    @Body() dto: updateChallengeDTO,
  ): Promise<void> {
    await this.challengeService.updateChallenge(challengeId, dto);
  }

  @Delete(':challengeId')
  async deleteOne(
    @Param('challengeId', ValidationParamsPipe) challengeId: string,
  ): Promise<void> {
    await this.challengeService.deleteOne(challengeId);
  }

  @Post(':challengeId/match')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMatch(
    @Param('challengeId', ValidationParamsPipe) challengeId: string,
    @Body() dto: addMatchToChallengeDTO,
  ): Promise<void> {
    await this.challengeService.addMatch(challengeId, dto);
  }
}
