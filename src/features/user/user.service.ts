import { Injectable } from '@nestjs/common';
import { CrudHandler } from '../crud/crud.handler';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PaginateQuery, PaginateConfig, Paginated } from 'nestjs-paginate';
import * as bcrypt from 'bcrypt';
import { ReadUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/read-user.dto';
import { CreateUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/create-user.dto';

@Injectable()
export class UserService extends CrudHandler<User, CreateUserDto,ReadUserDto> {
    constructor(
        @InjectRepository(User)
        protected userRepository:Repository<User>
    ){
        super(userRepository);
    }

    mapRead(entity: User): ReadUserDto {
        return {
            created_at:entity.created_at,
            deleted_at:entity.deleted_at,
            updated_at:entity.updated_at,
            id:entity.id,
            username:entity.username
        };
    }
    
    async validate(username:string, password:string){
        const user = await this.userRepository.findOneBy({username});
    }

    async hashPassword(password:string){
        return await bcrypt.hash(password, +process.env.USER_PASS_SALT_ROUNDS!);
    }
}