import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { updatePlayerDTO } from './dtos/updatePlayer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('api/v1/players')
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyInstance('admin');

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

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Param('id', ValidationParamsPipe) id: string,
  ) {
    this.logger.log(`Uploaded file ${JSON.stringify(file, null, 2)}`);

    try {
      const player = await this.clientAdminBackend
        .send('get-players', id)
        .toPromise();
      if (!player) {
        throw new Error('');
      }
    } catch (err) {
      this.logger;
      throw new BadRequestException(`Player with id ${id} not found`);
    }

    const data = await this.awsService.uploadFile(file, id);
    const updatePlayerDTO: updatePlayerDTO = {
      urlProfilePicture: data.url,
    };

    await this.clientAdminBackend
      .emit('update-player', {
        id,
        dto: updatePlayerDTO,
      })
      .toPromise();

    return await this.clientAdminBackend.send('get-players', id).toPromise();
  }
}
