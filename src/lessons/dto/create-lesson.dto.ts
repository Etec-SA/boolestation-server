import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateLessonDto {
  @ApiProperty({ example: "Operadores - Negação" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "Aprenderemos sobre o operador unário de negação, seu valor semântico e como ele se aplica na linguagem natural",
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  moduleId: string;
}
