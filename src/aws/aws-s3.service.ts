import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  constructor(private readonly awsS3Config: AwsS3Config) {}

  public async uploadFile(file: Express.Multer.File, id: string): Promise<any> {
    const s3 = new AWS.S3({
      accessKeyId: this.awsS3Config.accessKeyId,
      secretAccessKey: this.awsS3Config.secretKey,
      region: this.awsS3Config.region,
    });

    const fileExtension = file.originalname.substr(-3);
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey:${urlKey}`);

    const params = {
      Bucket: this.awsS3Config.bucket,
      Key: urlKey,
      Body: file.buffer,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          this.logger.log(data);
          const url = `https://${this.awsS3Config.bucket}.s3-${this.awsS3Config.region}.amazonaws.com/${urlKey}`;
          return { url };
        },
        (err) => {
          if (err) {
            this.logger.error(err);
            return { err };
          }
        },
      );
    return data;
  }
}
