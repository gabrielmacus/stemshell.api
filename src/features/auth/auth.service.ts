import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import passport from 'passport';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        protected userRepository:Repository<User>,
        protected jwtService:JwtService
    ){
    }
    
    async validateUser(username:string, pass:string){
        const user = await this.userRepository.findOneBy({username});
        const result = user ? 
            await bcrypt.compare(pass, user.password) : false;
        if(!result) return undefined;
        return user as User;
    }
    
    /*
    async handleLogin(req:Request){
        
        const payload = {
            username:user.username,
            sub:user.id
        };
        const access_token = await this.jwtService.signAsync(payload)
        return {
            access_token
        };
    }*/
}
