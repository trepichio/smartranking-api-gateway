import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsCognitoConfig {
  constructor(private readonly configService: ConfigService) {}

  public userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
  public clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
  public region = this.configService.get<string>('AWS_REGION');
  public authority = this.configService.get<string>('AUTHORITY');
}
