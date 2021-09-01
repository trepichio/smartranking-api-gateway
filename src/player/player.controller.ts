import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { updatePlayerDTO } from './dtos/updatePlayer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/players')
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createPlayer(@Body() dto: createPlayerDTO) {
    await this.playerService.createPlayer(dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePlayer(
    @Param('id', ValidationParamsPipe) id: string,
    @Body()
    dto: updatePlayerDTO,
  ) {
    await this.playerService.updatePlayer(id, dto);
  }

  @Get()
  async getPlayers(
    @Query('playerId') _id: string = '',
    @Req() req: Request,
  ): Promise<any> {
    this.logger.log(`Request: ${JSON.stringify(req.user, null, 2)}`);
    return await this.playerService.getPlayers(_id);
  }

  @Delete(':id')
  deletePlayer(@Param('id', ValidationParamsPipe) id: string) {
    this.playerService.deletePlayer(id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Param('id', ValidationParamsPipe) id: string,
  ): Promise<any> {
    this.logger.log(`Uploading file for profile picture of player id: ${id}`);

    return await this.playerService.uploadFile(file, id);
  }
}
