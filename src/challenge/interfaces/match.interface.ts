import { IPlayer } from 'src/player/interfaces/player.interface';

export interface IMatch {
  challenge?: string;
  category?: string;
  players?: Array<IPlayer>;
  winner?: IPlayer;
  result?: Array<IResult>;
}

export interface IResult {
  set: string;
}
