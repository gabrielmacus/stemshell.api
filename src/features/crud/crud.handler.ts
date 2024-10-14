import { NotFoundException } from "@nestjs/common";
import { paginate, PaginateConfig, Paginated, PaginateQuery } from "nestjs-paginate";
import { Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseModel } from "./entities/base-model.entity";

// https://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-service
export abstract class CrudHandler<TEntity extends BaseModel> {

    constructor(
        protected repository:Repository<TEntity>
    ){
    }

    
    async handleCreate(entity: TEntity) {
        return await this.repository.save(entity);
    }
    
    async handleFindAll(query:PaginateQuery, config:PaginateConfig<TEntity>) {
        return await paginate(
            query, 
            this.repository,
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