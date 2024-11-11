import { Controller } from '@nestjs/common';
import { CrudControllerFactory } from '../crud/crud-controller.factory';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { SessionPaginationConfig } from './config/SessionPaginationConfig';

@Controller('session')
export class SessionController extends CrudControllerFactory(Session) {

    constructor(
        protected sessionService: SessionService
      ) {
        super(sessionService, SessionPaginationConfig);
      }
}
