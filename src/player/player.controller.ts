import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { updatePlayerDTO } from './dtos/updatePlayer.dto';

@Controller('api/v1/players')
export class PlayerController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createPlayer(@Body() dto: createPlayerDTO) {
    const category = await this.clientAdminBackend
      .send('get-categories', dto.category)
      .toPromise();

    if (!category) {
      throw new BadRequestException(
        `Category with id ${dto.category} not found`,
      );
    }

    this.clientAdminBackend.emit('create-player', dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePlayer(
    @Param('id', ValidationParamsPipe) id: string,
    @Body()
    dto: updatePlayerDTO,
  ) {
    const category = await this.clientAdminBackend
      .send('get-categories', {
        _id: dto.category,
      })
      .toPromise();

    if (!category) {
      throw new BadRequestException(
        `Category with id ${dto.category} not found`,
      );
    }

    this.clientAdminBackend.emit('update-player', {
      id,
      dto,
    });
  }

  @Get()
  getPlayers(@Query('playerId') _id: string = '') {
    return this.clientAdminBackend.send('get-players', _id);
  }

  @Delete(':id')
  deletePlayer(@Param('id', ValidationParamsPipe) id: string) {
    return this.clientAdminBackend.emit('delete-player', { id });
  }
}
