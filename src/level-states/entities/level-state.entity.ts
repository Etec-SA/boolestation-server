import { ApiProperty } from "@nestjs/swagger";
import { LevelState } from "@prisma/client";

export class LevelStateEntity implements LevelState {

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  requiredXp: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
