import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends CrudService<User> {
    constructor(
        @InjectRepository(User)
        protected userRepository:Repository<User>
    ){
        super(userRepository);
    }

    async hashPassword(password:string){
        return await bcrypt.hash(password, +process.env.USER_PASS_SALT_ROUNDS!);
    }
    
}
