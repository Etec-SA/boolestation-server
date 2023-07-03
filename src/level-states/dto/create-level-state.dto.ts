import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateLevelStateDto {
  @IsNotEmpty({ message: 'O título não pode estar vazio.' })
  @IsString({ message: 'O título precisa ser uma string.' })
  title: string;

  @IsNotEmpty({ message: 'O campo "requiredXp" não pode estar vazio.' })
  @IsInt({ message: 'O campo "requiredXp" precisa ser um número inteiro.' })
  requiredXp: number;
}
