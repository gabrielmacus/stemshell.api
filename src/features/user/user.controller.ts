import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UserPaginationConfig } from './config/user-pagination.config';
import { CreateUserDto, createUserSchema } from 'src/features/external/core/stemshell.shared/src/features/user/create-user.dto';
import { ZodValidationPipe } from '../crud/zod-validation.pipe';
import { CrudController } from '../crud/crud.controller';
import { User } from './entities/user.entity';
import { ReadUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/read-user.dto';
import { UpdateUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/update-user.dto';
// USE INTERFACE
@Controller('user')
export class UserController extends CrudController<User,CreateUserDto,UpdateUserDto, ReadUserDto> {
  
  constructor(
    @Inject()
    userService: UserService
  ) {
    super(userService, UserPaginationConfig)
  }

  /*
  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) 
    createUserDto: CreateUserDto) 
  {
    return await this.userService.handleCreate(createUserDto);
  }
  

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.userService
      .handleFindAll(query, UserPaginationConfig);
  }*/
}
