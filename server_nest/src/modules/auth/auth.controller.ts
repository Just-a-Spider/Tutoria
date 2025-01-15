import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res() res) {
    res.clearCookie('access_token');
    return res.status(200).json({ detail: 'Logout successful' });
  }
}

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('login/google-oauth2')
  @ApiOperation({ summary: 'Redirect to Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth2 login' })
  async googleLogin(@Res() res) {
    // Get the URL from the strategy
    const url = await this.authService.getGoogleOAuthUrl();
    return res.redirect(url);
  }

  @Get('complete/google-oauth2')
  @ApiOperation({ summary: 'Google OAuth2 login callback' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to frontend after successful login',
  })
  @ApiResponse({ status: 400, description: 'Authorization code not provided' })
  @ApiResponse({
    status: 500,
    description: 'Failed to authenticate with Google',
  })
  async googleLoginCallback(@Req() req, @Res() res) {
    const code = req.query.code;
    if (!code) {
      return res
        .status(400)
        .json({ detail: 'Authorization code not provided' });
    }

    try {
      const payload = await this.authService.googleLogin(code);
      res.cookie('access_token', payload.access_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ detail: 'Failed to authenticate with Google' });
    }
  }
}
