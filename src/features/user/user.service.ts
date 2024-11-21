import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService extends CrudService<User> {
    constructor(
        @InjectRepository(User)
        protected userRepository:Repository<User>,
        protected configService: ConfigService
    ){
        super(userRepository);
    }

    async hashPassword(password:string){
        return await bcrypt.hash(password,this.configService.get<number>('USER_PASS_SALT_ROUNDS')!);
    }
    
}
