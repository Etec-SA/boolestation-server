import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  xp: number;

  @ApiProperty()
  isPremium: boolean;

  @ApiProperty()
  levelStateId: string;

  @ApiProperty()
  profilePictureId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
