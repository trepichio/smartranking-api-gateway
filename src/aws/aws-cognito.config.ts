import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsCognitoConfig {
  constructor(private readonly configService: ConfigService) {}

  /**
   * The AWS Cognito User Pool ID to use.
   */
  public userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');

  /**
   * The AWS Cognito User Pool Client ID to use.
   * This is the ID of the app in the User Pool.
   */
  public clientId = this.configService.get<string>('COGNITO_CLIENT_ID');

  /**
   * The AWS Region to use.
   * This is the region where the User Pool is located.
   * For example, us-east-1.
   */
  public region = this.configService.get<string>('AWS_REGION');

  /**
   * The AWS Cognito User Pool Domain to use.
   * This is the domain of the User Pool.
   * For example, https://cognito-idp.us-east-1.amazonaws.com/my-user-pool-id
   */
  public authority = this.configService.get<string>('AUTHORITY');
}
