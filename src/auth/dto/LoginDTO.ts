import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty({ example: "luca@poe.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "¢³12910zna" })
  @IsString()
  password: string;
}
