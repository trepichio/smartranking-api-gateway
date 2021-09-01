import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Config {
  constructor(private readonly configService: ConfigService) {}

  /**
   * The AWS region to use.
   */
  public region: string = this.configService.get<string>('AWS_REGION');

  /**
   * The AWS access key ID to use.
   * @default - No AWS access key
   *  */
  public accessKeyId?: string =
    this.configService.get<string>('AWS_ACCESS_KEY_ID');

  /**
   * The AWS secret key to use.
   * @default - No AWS secret key
   * */
  public secretKey?: string = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );

  /**
   * The AWS Bucket to use.
   * @default - No AWS Bucket
   * */
  public bucket?: string = this.configService.get<string>('AWS_BUCKET');
}
