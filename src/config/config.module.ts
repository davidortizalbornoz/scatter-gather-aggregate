import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: '.env',
      validate,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
