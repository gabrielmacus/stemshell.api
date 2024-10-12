import { NotFoundException } from "@nestjs/common";
import { paginate, PaginateConfig, Paginated, PaginateQuery } from "nestjs-paginate";
import { Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseModel } from "./base-model.entity";

// https://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-service
export abstract class CrudHandler<TEntity extends BaseModel,
                        TCreate = TEntity,
                        TUpdate = Partial<TCreate>,
                        TRead = TEntity, 
                        > {

    constructor(
        protected repository:Repository<TEntity>
    ){
    }

    protected abstract mapRead:(entity:TEntity) => TRead
    protected abstract mapCreate:(entity:TCreate) => TEntity
    protected abstract  mapUpdate:(entity:TUpdate) => QueryDeepPartialEntity<TEntity>

    async handleCreate(createDto: TCreate) {
        const result =  await this.repository.save(await this.mapCreate(createDto));
        return await this.mapRead(result);
    }
    
    async handleFindAll(query:PaginateQuery, config:PaginateConfig<TEntity>) {
        const result = await paginate(
            query, 
            this.repository,
            config);

        return {
            ...result,
            ...{
                data:await Promise.all(
                    result.data.map(async(i)=>this.mapRead(i))
                )
            }
        };
    }

    async handleFindOne(id: number) {
        //https://github.com/typeorm/typeorm/issues/8939
        //@ts-expect-error
        const result = await this.tipoInfraccionRepository
            .findOneBy({id});
        if(!result) throw new NotFoundException();
        return await this.mapRead(result);
    }
    
    async handleUpdate(id: number, updateDto: TUpdate) {
        //https://github.com/typeorm/typeorm/issues/8939
        //@ts-expect-error
        if (!await this.repository.existsBy({id})) 
            throw new NotFoundException();
        const entity = await this.mapUpdate(updateDto);
        const result =  await this.repository
            .update(id, entity);
        
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