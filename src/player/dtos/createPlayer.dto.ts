import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';

export class createPlayerDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly mobileNumber: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly category: string;
}
