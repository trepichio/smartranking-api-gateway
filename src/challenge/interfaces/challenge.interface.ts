import { IPlayer } from 'src/player/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface IChallenge {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeReply: Date;
  requester: IPlayer;
  category: string;
  match?: string;
  players: Array<IPlayer>;
}
