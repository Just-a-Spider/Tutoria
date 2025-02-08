import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const mikroOrmConfig: Options = {
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME || 'tutoria_nest',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '0116',
  port: parseInt(process.env.DB_PORT) || 5432,
  host: process.env.DB_HOST || 'localhost',
  migrations: {
    tableName: 'mikro_orm_migrations',
  },
  baseDir: process.cwd(),
  entities: ['dist/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
  debug: false,
};

export default mikroOrmConfig;
