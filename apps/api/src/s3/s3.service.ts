import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Config from './config/s3.config';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  constructor(
    @Inject(s3Config.KEY) private _s3Config: ConfigType<typeof s3Config>,
  ) {
    this.s3Client = new S3Client({
      region: 'us-east-1', // Required, but use endpoint for Spaces
      endpoint: this._s3Config.endpoint!,
      credentials: {
        accessKeyId: this._s3Config.accessKeyId!,
        secretAccessKey: this._s3Config.secretAccessKey!,
      },
    });
  }
  async uploadVideo(
    key: string,
    contentType: string,
    expiresIn: Date = new Date(Date.now() + 60 * 60 * 1000),
  ) {
    return createPresignedPost(this.s3Client, {
      Bucket: this._s3Config.bucket!,
      Key: key,
      Fields: {
        key,
        expiresIn: expiresIn.toISOString(),
      },
      Conditions: [
        ['starts-with', '$Content-Type', contentType],
        // ['content-length-range', 0, UPLOAD_MAX_FILE_SIZE],
      ],
    });
  }

  async getSignedUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this._s3Config.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
