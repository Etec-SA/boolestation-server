import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateModuleDto {
  @ApiProperty({ example: "Lógica Proposicional" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "Disciplina introdutória da Lógica Clássica, onde aprenderemos sobre proposições, tabelas-verdade, etc.",
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
