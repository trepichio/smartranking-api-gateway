import { IsEnum, IsNotIn, IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';
import { Transform } from 'class-transformer';

export class updateChallengeDTO {
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(ChallengeStatus)
  @IsNotIn([ChallengeStatus.PENDING])
  status: ChallengeStatus;
}
