import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  constructor(private readonly awsS3Config: AwsS3Config) {}

  public async uploadFile(file: Express.Multer.File, id: string): Promise<any> {
    try {
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

      const data = await s3.putObject(params).promise();

      this.logger.log(`data:${JSON.stringify(data, null, 2)}`);

      const url = `https://${this.awsS3Config.bucket}.s3-${this.awsS3Config.region}.amazonaws.com/${urlKey}`;

      return { url };
    } catch (err) {
      throw err.message;
    }
  }
}
