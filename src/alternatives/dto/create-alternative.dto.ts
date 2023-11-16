import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAlternativeDto {
  @ApiProperty({ example: "A Lógica Formal foi criada em 1999" })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty()
  @IsUUID()
  exerciseId: string;
}
