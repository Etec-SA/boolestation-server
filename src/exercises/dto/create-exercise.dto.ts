import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateExerciseDto {
  @ApiProperty({ example: "Eliminando duplas negações" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "Dada a formula (¬¬¬P ^ ¬¬Q), qual seria sua simplificação sem duplas negações?",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  lessonId: string;
}
