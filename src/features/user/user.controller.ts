import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UserPaginationConfig } from './config/user-pagination.config';
import { CreateUserDto, createUserSchema } from 'src/features/external/core/stemshell.shared/src/features/user/create-user.dto';
import { ZodValidationPipe } from '../crud/zod-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  }
}
