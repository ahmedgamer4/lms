import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import youtubeConfig from './config/youtube.config';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubeService implements OnModuleInit {
  private oauth2client: OAuth2Client;
  private youtube?: youtube_v3.Youtube;

  constructor(
    @Inject(youtubeConfig.KEY)
    private youtubeConfigProvider: ConfigType<typeof youtubeConfig>,
  ) {
    this.oauth2client = new google.auth.OAuth2(
      this.youtubeConfigProvider.clientId,
      this.youtubeConfigProvider.clientSecret,
      this.youtubeConfigProvider.redirectUri,
    );

    const refreshToken = this.youtubeConfigProvider.refreshToken;
    this.oauth2client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  async onModuleInit() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2client,
    });
  }

  async initResumableUpload(
    videoMetadata: youtube_v3.Schema$Video,
    videoFileSize: number,
    videoMimeType: string,
  ) {
    const youtubeClient = this.youtube;

    try {
      const resumableInitiateUrl = `https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=${Object.keys(videoMetadata).join(',')}`;

      const response = await this.oauth2client.request({
        method: 'POST',
        url: resumableInitiateUrl,
        headers: {
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': videoMimeType,
          'X-Upload-Content-Length': videoFileSize.toString(),
        },
      });

      const uploadUrl = response.headers['location'];

      if (!uploadUrl) {
        throw new Error('Failed to get upload URL');
      }

      console.log('Upload URL:', uploadUrl);
      return uploadUrl;
    } catch (error: any) {
      if (
        error.response?.status === 401 ||
        error.response?.data?.error === 'invalid_grant'
      ) {
        console.error(
          'YouTube authentication failed. Refresh token might be invalid or revoked.',
        );
        // Implement logic to notify admin or re-run the one-time auth flow
      }
      throw new InternalServerErrorException(error);
    }
  }
}
