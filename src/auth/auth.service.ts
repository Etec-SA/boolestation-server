import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserPayload } from './entities/user-payload.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async login(user: UserEntity) {
        const {username, email, name, id, isAdmin, isPremium} = user;

        const payload: UserPayload = {
            username,
            email,
            name,
            roles: {
                isAdmin,
                isPremium
            },
            sub: id
        }

        const token = this.jwtService.sign(payload);

        return{
            access_token: token
        }
    }

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

    async validateAdmin(id: string){
        const user = await this.userService.findOne(id);
        console.log(user.isAdmin);
        if(!user.isAdmin) throw new UnauthorizedException('You dont have permission.');
        return true;
    }
}
