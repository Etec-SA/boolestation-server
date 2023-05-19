import { IsNotEmpty, IsString } from "class-validator";

export class CreateLevelStateDto {
    @IsNotEmpty({message: 'O título não pode estar vazio.'})
    @IsString({message: 'O título precisa ser uma string.'})
    title: string;
}
