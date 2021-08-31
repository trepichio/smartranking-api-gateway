import { IsEmail, IsMobilePhone, IsString, Matches } from 'class-validator';

export class AuthSignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  /**
   * Password must be
   * at least 8 characters long
   * at least one uppercase letter
   * at least one lowercase letter
   * and contain at least one number
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g, {
    message: 'Password is required',
  })
  password: string;

  @IsMobilePhone('pt-BR')
  mobilePhone: string;
}
