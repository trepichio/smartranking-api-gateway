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

}
