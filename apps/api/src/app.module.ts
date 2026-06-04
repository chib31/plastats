import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, StatsModule],
  controllers: [AppController],
})
export class AppModule {}
