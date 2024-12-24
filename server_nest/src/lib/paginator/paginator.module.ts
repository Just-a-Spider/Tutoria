import { DynamicModule, Global, Module } from '@nestjs/common';
import { Paginator } from './paginator';

interface PaginatorModuleOptions {
  pageSize?: number;
}

@Global()
@Module({})
export class PaginatorModule {
  static forRoot(options: PaginatorModuleOptions): DynamicModule {
    return {
      module: PaginatorModule,
      providers: [
        {
          provide: Paginator,
          useFactory: () => {
            return new Paginator(options.pageSize ?? 20);
          },
        },
      ],
      exports: [Paginator],
    };
  }
}
