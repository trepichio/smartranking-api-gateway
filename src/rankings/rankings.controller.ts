import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/rankings')
export class RankingsController {
  private readonly logger = new Logger(RankingsController.name);

  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async getRankings(
    @Query('categoryId') categoryId: string,
    @Query('dateRef') dateRef: string = '',
  ): Promise<any> {
    return await this.rankingsService.getRankings(categoryId, dateRef);
  }
}
