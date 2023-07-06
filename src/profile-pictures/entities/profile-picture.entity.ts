import { ProfilePicture } from "@prisma/client";

export class ProfilePictureEntity implements ProfilePicture{
    id: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}
