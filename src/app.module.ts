import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './controllers/app.controller';
import { ConfigModule } from './config/config.module';
import { ScatterService } from './services/scatter.service';
import { GatherService } from './services/gather.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [ScatterService, GatherService],
})
export class AppModule {}