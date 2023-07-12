import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateLevelStateDto {

  @ApiProperty({ description: 'The title serves to name the level in which the user is.', example: 'O Logicista' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'is the amount of experience points the user needs to reach the level', example: 151 })
  @IsNotEmpty()
  @IsInt()
  requiredXp: number;
}
