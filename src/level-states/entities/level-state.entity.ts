import { LevelState } from "@prisma/client";

export class LevelStateEntity implements LevelState{
  id: string;

  title: string;

  requiredXp: number;
}
