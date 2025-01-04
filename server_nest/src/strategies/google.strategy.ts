import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // Meta Data
  public readonly scope: string[] = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
  ];
  public readonly prompt: string = 'consent';
  public readonly audience: string = process.env.GOOGLE_CLIENT_ID;

  // OAuthClientOptions
  private readonly oauthOptions: OAuth2ClientOptions = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_CALLBACK_URL,
  };

  public readonly oauthClient = new OAuth2Client(this.oauthOptions);

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;

    super({
      clientID: clientId,
      clientSecret,
      callbackURL: redirectUri,
      passReqToCallback: true,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.rosters.readonly',
      ],
      prompt: 'consent',
    });
  }
}
