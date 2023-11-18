import { Module } from "@nestjs/common";
import { AlternativesService } from "./alternatives.service";
import { AlternativesController } from "./alternatives.controller";
import { PrismaService } from "../database/prisma.service";
import { ExercisesModule } from "../exercises/exercises.module";

@Module({
  controllers: [AlternativesController],
  providers: [AlternativesService, PrismaService],
  imports: [ExercisesModule],
})
export class AlternativesModule {}
