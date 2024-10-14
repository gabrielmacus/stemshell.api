import { Injectable } from '@nestjs/common';
import { CrudHandler } from '../crud/crud.handler';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends CrudHandler<User> {
    constructor(
        @InjectRepository(User)
        protected userRepository:Repository<User>
    ){
        super(userRepository);
    }

    async validate(username:string, pass:string){
        const user = await this.userRepository.findOneBy({username});
        if(!user) return undefined;
        const result = await bcrypt.compare(pass, user.password);
        if(!result) return undefined;
        const { password, ...userData} = user;
        return userData
    }

    async hashPassword(password:string){
        return await bcrypt.hash(password, +process.env.USER_PASS_SALT_ROUNDS!);
    }
    
}
