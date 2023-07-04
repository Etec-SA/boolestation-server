import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateLevelStateDto {

  /**
   * The title serves to name the level in which the user is.
   * @example "O Logicista"
   */
  @IsNotEmpty({ message: 'O título não pode estar vazio.' })
  @IsString({ message: 'O título precisa ser uma string.' })
  title: string;

  /**
   * The requiredXp is the amount of experience 
   * points the user needs to reach the level.
   * @example 151
   */
  @IsNotEmpty({ message: 'O campo "requiredXp" não pode estar vazio.' })
  @IsInt({ message: 'O campo "requiredXp" precisa ser um número inteiro.' })
  requiredXp: number;
}
