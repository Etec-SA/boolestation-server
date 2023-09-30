import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { PrismaService } from '../database/prisma.service';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService, PrismaService],
  imports: [LessonsModule]
})
export class ExercisesModule { }
