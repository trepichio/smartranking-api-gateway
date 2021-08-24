import { IsNotEmpty } from 'class-validator';
import { IPlayer } from 'src/player/interfaces/player.interface';
import { IResult } from '../interfaces/match.interface';

export class addMatchToChallengeDTO {
  @IsNotEmpty()
  winner: IPlayer;

  @IsNotEmpty()
  result: Array<IResult>;
}
