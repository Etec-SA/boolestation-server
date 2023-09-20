import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService, PrismaService]
})
export class ExercisesModule { }
