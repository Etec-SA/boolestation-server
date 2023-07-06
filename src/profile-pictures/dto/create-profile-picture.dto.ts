import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfilePictureDto {

  /**
  * The title serves to name the photo.
  * @example "Aristotle"
  */
  @IsNotEmpty({ message: 'the title cannot be empty.' })
  @IsString({ message: 'the title needs to be a string.' })
  title: string;

  /**
  * The photo source.
  * @example "https://boolestation.com/public/aristotle.png"
  */
  @IsNotEmpty({ message: 'the title cannot be empty.' })
  @IsString({ message: 'the title needs to be a string.' })
  url: string;
}
