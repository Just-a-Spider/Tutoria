import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

// This interceptor is used to add the API key to the request headers
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      'X-API-KEY': environment.apiKey,
    },
  });
  return next(req);
};
