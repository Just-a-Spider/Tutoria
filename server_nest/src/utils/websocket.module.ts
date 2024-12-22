import { DynamicWebSocketAdapter } from '@/adapters/dynamic-websocket.adapter';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [DynamicWebSocketAdapter, TokenService],
  exports: [DynamicWebSocketAdapter],
})
export class WebsocketModule {}
