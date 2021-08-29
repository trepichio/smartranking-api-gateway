import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from '@nestjs/common';
import { RankingsService } from './rankings.service';

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
