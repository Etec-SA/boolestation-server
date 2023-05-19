import { IsDate, IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio.' })
    @Length(4, 22, { message: 'O nome de usuário deve ter entre 4 e 20 caracteres.' })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'O nome de usuário deve conter apenas letras, números, traços e underlines.'
    })
    username: string;

    @IsEmail(null, {message: 'O endereço de email é inválido.'})
    email: string;

    @IsNotEmpty({message: 'A senha não pode estar vazia.'})
    @Length(8, 128, {message: 'A senha deve ter entre 8 a 128 caracteres'})
    password: string;

    @IsNotEmpty({message: 'A data de nascimento não pode estar vazia.'})
    @IsDate({message: 'O valor inserido não é uma data.'})
    birthdate: Date;

    @IsNotEmpty({message: 'O nome não pode estar vazio.'})
    @Length(1, 100, {message: 'O nome deve conter entre 1 a 100 caracteres.'})
    name: string;
}
