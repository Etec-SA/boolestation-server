import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { PrismaService } from "../database/prisma.service";
import { ModulesModule } from "../modules/modules.module";
import { LessonsCacheService } from "./cache/lessons-cache.service";

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, PrismaService, LessonsCacheService],
  imports: [ModulesModule],
  exports: [LessonsService],
})
export class LessonsModule {}
