import { NotFoundException } from "@nestjs/common";
import { paginate, PaginateConfig, Paginated, PaginateQuery } from "nestjs-paginate";
import { DeepPartial, ObjectLiteral, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseModel } from "./base-model.entity";

// https://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-servicehttps://softwareengineering.stackexchange.com/questions/306890/is-it-bad-practice-that-a-controller-calls-a-repository-instead-of-a-service
export class CrudHandler<TEntity extends BaseModel,
                        TCreate = TEntity,
                        TRead = TEntity, 
                        TUpdate = Partial<TEntity>> {

    constructor(
        protected repository:Repository<TEntity>
    ){
    }

    mapCreate(createDto:TCreate) {
        return createDto as unknown as TEntity;
    }

    mapRead(entity:TEntity){
        return entity as unknown as TRead
    }

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
    
    async handleUpdate<T extends QueryDeepPartialEntity<TEntity>>(id: number, updateDto: T) {
        //https://github.com/typeorm/typeorm/issues/8939
        //@ts-expect-error
        if (!await this.repository.existsBy({id})) 
            throw new NotFoundException();
        
        const result =  await this.repository
            .update(id, updateDto);
        
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