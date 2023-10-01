import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfilePictureDto {
  @ApiProperty({
    example: "Aristotle",
    description: "The title serves to name the photo",
  })
  @IsNotEmpty({ message: "the title cannot be empty." })
  @IsString({ message: "the title needs to be a string." })
  title: string;

  @ApiProperty({
    example: "https://boolestation.com/public/aristotle.png",
    description: "The photo source",
  })
  @IsNotEmpty({ message: "the title cannot be empty." })
  @IsString({ message: "the title needs to be a string." })
  url: string;
}
