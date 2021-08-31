import { IsEmail, Matches } from 'class-validator';

export class AuthLoginUserDto {
  @IsEmail()
  email: string;

  /**
   * Password must be
   * at least 8 characters long
   * at least one uppercase letter
   * at least one lowercase letter
   * and contain at least one number
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password is required',
  })
  password: string;
}
