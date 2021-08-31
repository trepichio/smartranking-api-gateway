import { Injectable, Logger } from '@nestjs/common';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from 'src/auth/dtos/auth-login-user.dto';
import { AuthSignupDto } from 'src/auth/dtos/auth-signup.dto';
import { AwsCognitoConfig } from './aws-cognito.config';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  private logger = new Logger(AwsCognitoService.name);

  constructor(private readonly awsCognitoConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.awsCognitoConfig.userPoolId,
      ClientId: this.awsCognitoConfig.clientId,
    });
  }

  async registerUser(authSignupDto: AuthSignupDto): Promise<any> {
    const { email, password, name, mobilePhone } = authSignupDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'name', Value: name }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: mobilePhone,
          }),
        ],
        null,
        (err, result) => {
          if (err) {
            this.logger.log(err);
            reject(err);
          }
          resolve(result.user);
        },
      );
    });
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDto): Promise<any> {
    const { email, password } = authLoginUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          if (err) {
            this.logger.log(err);
            reject(err);
          }
        },
      });
    });
  }
}
