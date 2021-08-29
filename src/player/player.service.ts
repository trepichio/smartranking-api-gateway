import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy.provider';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { updatePlayerDTO } from './dtos/updatePlayer.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyInstance('admin');

  async createPlayer(dto: createPlayerDTO): Promise<any> {
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

  async updatePlayer(id: string, dto: updatePlayerDTO): Promise<any> {
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

  async getPlayers(_id: string = ''): Promise<any> {
    return await this.clientAdminBackend.send('get-players', _id).toPromise();
  }

  deletePlayer(id: string) {
    return this.clientAdminBackend.emit('delete-player', { id });
  }

  async uploadFile(file: any, id: string): Promise<any> {
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
    this.logger.log(`Uploaded file ${JSON.stringify(file, null, 2)}`);

    const updatePlayerDTO: updatePlayerDTO = {
      urlProfilePicture: data.url,
    };

    await this.clientAdminBackend
      .emit('update-player', {
        id,
        dto: updatePlayerDTO,
      })
      .toPromise();
    this.logger.log(`Updated Profile Picture of player id: ${id}`);

    return await this.clientAdminBackend.send('get-players', id).toPromise();
  }
}
