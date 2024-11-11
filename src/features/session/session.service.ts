import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, PaginateConfig, Paginated, paginate } from 'nestjs-paginate';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SessionService extends CrudService<Session> {
    constructor(
        @InjectRepository(Session)
        protected sessionRepository:Repository<Session>
    )
    {
        super(sessionRepository);
    }

}
