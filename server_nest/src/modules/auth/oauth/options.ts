import { OAuth2ClientOptions } from 'google-auth-library';

export const oauthOptions: OAuth2ClientOptions = {
  clientId:
    process.env.GOOGLE_CLIENT_ID ||
    '537012742971-r468a4u676c5vruvd6rsrjhd36vdqp10.apps.googleusercontent.com',
  clientSecret:
    process.env.GOOGLE_CLIENT_SECRET || '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',
  redirectUri:
    process.env.GOOGLE_CALLBACK_URL ||
    'http://127.0.0.1:8000/api/oauth/complete/google-oauth2/',
};
