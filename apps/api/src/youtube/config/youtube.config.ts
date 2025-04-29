import { registerAs } from '@nestjs/config';

export default registerAs('youtube', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  refreshToken: process.env.YOUTUBE_OAUTH_REFRESH_TOKEN,
}));
