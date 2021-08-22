import { PlayerInterface } from 'src/player/interfaces/player.interface';

export interface MatchInterface {
  challenge?: string;
  category?: string;
  players?: Array<PlayerInterface>;
  winner?: PlayerInterface;
  result?: Array<ResultInterface>;
}

export interface ResultInterface {
  set: string;
}
