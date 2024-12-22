import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { oauthClient } from './oauth/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    // get the payload or message from the service
    const payload = await this.authService.login(loginDto);
    // Check if the response is a payload or a message
    if (payload.message) {
      return res.status(401).json({ detail: payload.message });
    }
    res.cookie('access_token', payload.access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({ detail: 'Login successful' });
  }

  @Get('logout')
  async logout(@Res() res) {
    res.clearCookie('access_token');
    return res.status(200).json({ detail: 'Logout successful' });
  }
}

@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/google-oauth2')
  async googleLogin(@Res() res) {
    // Get the URL from the strategy
    const url = await this.authService.getGoogleOAuthUrl();
    return res.redirect(url);
  }

  @Get('complete/google-oauth2')
  async googleLoginCallback(@Req() req, @Res() res) {
    const code = req.query.code;
    if (!code) {
      return res
        .status(400)
        .json({ detail: 'Authorization code not provided' });
    }

    try {
      const { tokens } = await oauthClient.getToken(code);
      const googleLoginDto = new GoogleLoginDto();
      googleLoginDto.idToken = tokens.id_token;
      googleLoginDto.accessToken = tokens.access_token;

      const payload = await this.authService.googleLogin(googleLoginDto);
      res.cookie('access_token', payload.access_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.redirect(process.env.FRONTEND_URL || 'http://localhost:4200');
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ detail: 'Failed to authenticate with Google' });
    }
  }
}
