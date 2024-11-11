import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    protected userRepository:Repository<User>
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  deserializeUser(username: string, done: Function) {
    const user = this.userRepository.findOneBy({username});
    
    if (!user) {
      return done(
        `Could not deserialize user: user with ${username} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}