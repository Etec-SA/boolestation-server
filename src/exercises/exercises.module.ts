import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { PrismaService } from '../database/prisma.service';
import { ModulesModule } from '../modules/modules.module';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService, PrismaService],
  imports: [ModulesModule]
})
export class ExercisesModule { }
