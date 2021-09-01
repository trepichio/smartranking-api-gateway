import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsS3Config } from './aws-s3.config';
import { AwsS3Service } from './aws-s3.service';

@Module({
  providers: [AwsS3Service, AwsCognitoService, AwsCognitoConfig, AwsS3Config],
  exports: [AwsS3Service, AwsCognitoService, AwsCognitoConfig, AwsS3Config],
})
export class AwsModule {}
