import { ApiProperty } from "@nestjs/swagger";
import { ProfilePicture } from "@prisma/client";

export class ProfilePictureEntity implements ProfilePicture {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
