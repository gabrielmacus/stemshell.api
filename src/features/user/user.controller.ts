import {  Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPaginationConfig } from './config/user-pagination.config';
import { User } from './entities/user.entity';
import { CrudControllerFactory } from '../crud/crud-controller.factory';

@Controller('user')
export class UserController extends CrudControllerFactory(User) {
  
  constructor(
    @Inject()
    protected userService: UserService
  ) {
    super(userService, UserPaginationConfig);
  }

}
