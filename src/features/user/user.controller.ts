import { Body, Controller, Inject, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPaginationConfig } from './config/user-pagination.config';
import { CreateUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/create-user.dto';
import { User } from './entities/user.entity';
import { ReadUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/read-user.dto';
import { UpdateUserDto } from 'src/features/external/core/stemshell.shared/src/features/user/update-user.dto';
import { CrudController } from '../crud/crud.controller';
// USE INTERFACE
@Controller('user')
export class UserController extends CrudController<User,CreateUserDto,UpdateUserDto> {
  
  constructor(
    @Inject()
    protected userService: UserService
  ) {
    super(userService, UserPaginationConfig);
  }

  /*
  @Post()
  create(
    @Body(new ZodValidationPipe(createUserSchema))
    createDto: CreateUserDto
  ): Promise<ReadUserDto> {
    return super.create(createDto);
  }
  
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateUserSchema))updateDto: UpdateUserDto) {
    return super.update(id, updateDto);
  }*/

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
