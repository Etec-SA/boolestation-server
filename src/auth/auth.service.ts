import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService){}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        
        if(!user) throw new Error('Email or password is incorrect.');

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) throw new Error('Email or password is incorrect.');

        return{
            ...user,
            password: undefined
        }
    }
}
