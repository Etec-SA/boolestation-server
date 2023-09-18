import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaService } from '../database/prisma.service';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, PrismaService],
  imports: [ModulesModule]
})
export class LessonsModule { }
