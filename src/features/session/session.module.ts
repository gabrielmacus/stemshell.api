import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionSubscriber } from './session.subscriber';

@Module({
  imports:[TypeOrmModule.forFeature([Session])],
  providers: [SessionService, SessionSubscriber],
  controllers: [SessionController]
})
export class SessionModule {}
