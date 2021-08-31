import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthSignupDto } from './dtos/auth-signup.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() dto: AuthSignupDto) {
    return await this.awsCognitoService.registerUser(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: AuthLoginUserDto) {
    return await this.awsCognitoService.authenticateUser(dto);
  }
}
