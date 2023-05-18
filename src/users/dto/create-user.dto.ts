import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio.' })
    @Length(4, 22, { message: 'O nome de usuário deve ter entre 4 e 20 caracteres.' })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'O nome de usuário deve conter apenas letras, números, traços e underlines.'
    })
    username: string;

    @IsEmail(null, {message: 'O endereço de email é inválido.'})
    email: string

}
