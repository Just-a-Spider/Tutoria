/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as http from 'http';
import * as url from 'url';

export class WsAuthGuard {
  constructor(private readonly jwtService: any) {}
  // Authenticate user (implement your logic)
  private async authenticateUser(
    userId: string,
    request: http.IncomingMessage,
  ): Promise<boolean> {
    // Get the cookies from the request
    const cookies = request.headers.cookie;
    console.log('Cookies:', cookies);
    return true;
  }

  // Extract token from request
  private extractToken(request: http.IncomingMessage): string | null {
    // Check Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // Check query parameters
    const parsedUrl = url.parse(request.url, true);
    return (parsedUrl.query.token as string) || null;
  }
}
