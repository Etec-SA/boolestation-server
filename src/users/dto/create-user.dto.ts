import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: '@devgamon', description: 'User identification name' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Gabriel Gamon', description: 'User geral name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'devgamon@bool.com ', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ḱssw1Z2@oa.ms', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '1985-07-15', description: 'User birthdate' })
  @IsNotEmpty()
  @IsDate()
  birthdate: Date;
}
