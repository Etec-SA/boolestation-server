import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { GetLessonEntity } from "../entities/get-lesson.entity";

@Injectable()
export class LessonsCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  findAll() {
    return this.cache.get<GetLessonEntity[]>("lessons");
  }

  setLessons(lessons: any) {
    return this.cache.set("lessons", lessons);
  }

  clear() {
    return this.cache.del("lessons");
  }
}
