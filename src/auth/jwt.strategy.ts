import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AwsCognitoConfig } from 'src/aws/aws-cognito.config';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly Logger = new Logger(JwtStrategy.name);

  constructor(private authConfig: AwsCognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      audience: authConfig.clientId,

      issuer: authConfig.authority,

      algorithms: ['RS256'],

      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }

  public async validate(payload: any) {
    this.Logger.log(`validate: ${JSON.stringify(payload, null, 2)}`);

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
