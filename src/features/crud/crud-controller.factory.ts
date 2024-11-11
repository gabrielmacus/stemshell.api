import { Body, ClassSerializerInterceptor, Delete, Get, Param, Patch, PipeTransform, Post, Query, Type, UseInterceptors } from "@nestjs/common";
import { Paginate, PaginateConfig, PaginateQuery } from "nestjs-paginate";
import { CrudService } from "./crud.service";
import { BaseModel } from "./entities/base-model.entity";
import { QueryDeepPartialEntity, QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CrudValidationPipe } from "./pipes/validation.pipe";
import { ICrudController } from "./crud-controller.interface";
import { ObjectLiteral } from "typeorm";

// https://stackoverflow.com/questions/71394797/nestjs-reusable-controller-with-validation
export function CrudControllerFactory<TEntity extends ObjectLiteral>(
    entityType:Type<TEntity>
) 
    : Type<ICrudController<TEntity>>{
    
    const createValidationPipe = new CrudValidationPipe(entityType);
    const updateValidationPipe = new CrudValidationPipe(entityType, {
        skipMissingProperties:true
    })

    class CrudController<TEntity extends ObjectLiteral> 
        implements ICrudController<TEntity>{

        constructor(
            protected crudHandler:CrudService<TEntity>,
            protected paginationConfig:PaginateConfig<TEntity>
        ){
            
        }

        @UseInterceptors(ClassSerializerInterceptor)
        @Post()
        async create(
            @Body(createValidationPipe)
            entity: TEntity) 
        {
            return await this.crudHandler.handleCreate(entity);
        }

        @UseInterceptors(ClassSerializerInterceptor)
        @Get()
        async findAll(
            @Paginate() query: PaginateQuery, 
            @Query("relations") relations?:string) {
            
            return await this.crudHandler.handleFindAll(
                query, 
                //TODO: inyectar desde configuración para no tener que hacer una 
                //copia
                {...this.paginationConfig}, 
                relations);
        }

        @UseInterceptors(ClassSerializerInterceptor)
        @Get(':id')
        async findOne(@Param('id') id: string) {
            return await this.crudHandler.handleFindOne(+id);
        }

        @Patch(':id')
        async update(
            @Param('id') id: string, 
            @Body(updateValidationPipe) partialEntity: QueryDeepPartialEntity<TEntity>
        ) {
            return await this.crudHandler.handleUpdate(+id, partialEntity);
        }

        @Delete(':id')
        remove(@Param('id') id: string) {
            return this.crudHandler.handleRemove(+id);
        }
    }

    return CrudController

}