import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class updatePlayerDTO {
  @IsOptional()
  @IsNotEmpty()
  readonly mobileNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsNotEmpty()
  urlProfilePicture?: string;
}
