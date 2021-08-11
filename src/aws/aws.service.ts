import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  public async uploadFile(file: Express.Multer.File, id: string): Promise<any> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const fileExtension = file.originalname.substr(-3);
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey:${urlKey}`);

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: urlKey,
      Body: file.buffer,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          this.logger.log(data);
          const url = `https://${process.env.AWS_BUCKET}.s3-${process.env.AWS_REGION}.amazonaws.com/${urlKey}`;
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
