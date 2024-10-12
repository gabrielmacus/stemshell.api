import { Body, Delete, Get, Param, Patch, PipeTransform, Post } from "@nestjs/common";
import { Paginate, PaginateConfig, PaginateQuery } from "nestjs-paginate";
import { ZodValidationPipe } from "./zod-validation.pipe";
import { CrudHandler } from "./crud.handler";
import { BaseModel } from "./base-model.entity";

export class CrudController<TEntity extends BaseModel, 
                            TCreate = TEntity,
                            TUpdate = Partial<TCreate>,
                            TRead = TEntity >{

    constructor(
        protected crudHandler:CrudHandler<TEntity,TCreate,TUpdate, TRead>,
        protected paginationConfig:PaginateConfig<TEntity>
    ){
        
    }

    @Post()
    async create(
        @Body(new ZodValidationPipe<TCreate>()) createDto: TCreate) 
    {

        return await this.crudHandler.handleCreate(createDto);
    }

    @Get()
    async findAll(@Paginate() query: PaginateQuery) {
        return await this.crudHandler.handleFindAll(query, this.paginationConfig);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
     return await this.crudHandler.handleFindOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string, 
        @Body() updateDto: TUpdate
    ) {
        return await this.crudHandler.handleUpdate(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.crudHandler.handleRemove(+id);
    }
}