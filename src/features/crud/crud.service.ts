import { NotFoundException } from "@nestjs/common";
import { CompoundCondition, FieldCondition } from "@ucast/core";
import { allInterpreters, createSqlInterpreter, pg } from "@ucast/sql";
import { paginate, PaginateConfig, Paginated, PaginateQuery } from "nestjs-paginate";
import { ObjectLiteral, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { interpret } from '@ucast/sql/typeorm';

// https://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-service
export abstract class CrudService<TEntity extends ObjectLiteral> {

    constructor(
        protected repository:Repository<TEntity>
    ){
    }

    
    async handleCreate(entity: TEntity) {
        return await this.repository.save(entity);
    }
    
    async handleFindAll(
        query:PaginateQuery, 
        config:PaginateConfig<TEntity>,
        relations?:string) {

        config.select = !config.select && query.select? 
                                ['id',...query.select] : 
                                config.select;
        //Permito cargar las relaciones explicitamente
        config.relations = !config.relations ?  
                                relations?.split(",") : 
                                config.relations;

        return await paginate(
            query, 
            this.repository.createQueryBuilder(),
            config);
    }


    async handleFindOne(id: number) {
        //https://github.com/typeorm/typeorm/issues/8939
        //@ts-expect-error
        const result = await this.tipoInfraccionRepository
            .findOneBy({id});
        if(!result) throw new NotFoundException();
        return result;
    }
    
    async handleUpdate(id: number, partialEntity: QueryDeepPartialEntity<TEntity>) {
        //https://github.com/typeorm/typeorm/issues/8939
        //@ts-expect-error
        if (!await this.repository.existsBy({id})) 
            throw new NotFoundException();
        const result =  await this.repository
            .update(id, partialEntity);
        
        return { affected: result.affected };
    }

    async handleRemove(id: number) {
        //https://github.com/typeorm/typeorm/issues/8939
        //@ts-expect-error
        if(!await this.repository.existsBy({id}))
            throw new NotFoundException();

        const result = await this.repository
            .softDelete(id);

        return { affected: result.affected };
    }
}