/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCookie } from '@/utils/cookie.util';
import { TokenService } from '@/utils/token.service';
import { INestApplicationContext } from '@nestjs/common';
import * as http from 'http';

export class WsAuth {
  // Authenticate user (implement your logic)
  async authenticateUser(
    request: http.IncomingMessage,
    app: INestApplicationContext,
  ): Promise<{ success: boolean; message: string; user?: any }> {
    // Check if the request has cookies
    const cookies = request.headers.cookie;
    if (!cookies) {
      return { success: false, message: 'No cookies provided' };
    }

    // Get the access_token from the cookies
    const accessToken = getCookie(cookies, 'access_token');
    if (!accessToken) {
      return { success: false, message: 'No access token provided' };
    }

    // Verify the token
    const user = await app.get(TokenService).verifyToken(accessToken);
    if (!user || user === undefined || user.sub === undefined) {
      return { success: false, message: 'Invalid user' };
    }
    return { success: true, message: 'User authenticated', user };
  }
}
