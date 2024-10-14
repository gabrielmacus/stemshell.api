import { Paginated, PaginateQuery } from "nestjs-paginate";
import { BaseModel } from "./entities/base-model.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface ICrudController<TEntity  extends BaseModel>{
    create(entity: TEntity) : Promise<TEntity>;
    findAll(query: PaginateQuery):Promise<Paginated<TEntity>>;
    findOne(id: string): Promise<TEntity>;
    update(id: string,partialEntity: QueryDeepPartialEntity<TEntity>):
        Promise<{ affected?: number }>;
    remove(id: string):Promise<{ affected?: number }>;
}