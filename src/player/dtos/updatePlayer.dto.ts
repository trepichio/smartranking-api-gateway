import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class updatePlayerDTO {
  @IsNotEmpty()
  readonly mobileNumber: string;

  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsMongoId()
  readonly category: string;
}
