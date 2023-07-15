import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService){}
    validateUser(email: string, password: string) {
        throw new Error('Method not implemented.');
    }
}
