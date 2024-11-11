import { Paginated, PaginateQuery } from "nestjs-paginate";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ObjectLiteral } from "typeorm";

export interface ICrudController<TEntity  extends ObjectLiteral>{
    create(entity: TEntity) : Promise<TEntity>;
    findAll(query: PaginateQuery, relations?:string):Promise<Paginated<TEntity>>;
    findOne(id: string): Promise<TEntity>;
    update(id: string,partialEntity: QueryDeepPartialEntity<TEntity>):
        Promise<{ affected?: number }>;
    remove(id: string):Promise<{ affected?: number }>;
}