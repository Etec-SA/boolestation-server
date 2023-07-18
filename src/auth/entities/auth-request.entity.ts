import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

export interface AuthRequest extends Request {
  user: UserEntity;
}
