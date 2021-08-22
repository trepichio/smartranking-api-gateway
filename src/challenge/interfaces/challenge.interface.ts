import { PlayerInterface } from 'src/player/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface ChallengeInterface {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeReply: Date;
  requester: PlayerInterface;
  category: string;
  match?: string;
  players: Array<PlayerInterface>;
}
