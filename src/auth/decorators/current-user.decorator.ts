import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserEntity } from "../../users/entities/user.entity";
import { AuthRequest } from "../entities/auth-request.entity";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  }
);
