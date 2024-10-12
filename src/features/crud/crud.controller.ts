import { Body, ClassSerializerInterceptor, Delete, Get, Param, Patch, PipeTransform, Post, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { Paginate, PaginateConfig, PaginateQuery } from "nestjs-paginate";
import { CrudHandler } from "./crud.handler";
import { BaseModel } from "./base-model.entity";

export abstract class CrudController<TEntity extends BaseModel, 
                            TCreate = TEntity,
                            TUpdate = Partial<TCreate>,
                            TRead = TEntity >{

    constructor(
        protected crudHandler:CrudHandler<TEntity,TCreate,TUpdate, TRead>,
        protected paginationConfig:PaginateConfig<TEntity>
    ){
        
    }
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async create(
        @Body(new ValidationPipe())
        createDto: TCreate) 
    {
        return await this.crudHandler.handleCreate(createDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll(@Paginate() query: PaginateQuery) {
        return await this.crudHandler.handleFindAll(query, this.paginationConfig);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: string) {
     return await this.crudHandler.handleFindOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string, 
        @Body(new ValidationPipe()) updateDto: TUpdate
    ) {
        return await this.crudHandler.handleUpdate(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.crudHandler.handleRemove(+id);
    }
}