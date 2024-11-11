import { PaginateQuery } from "nestjs-paginate";

export interface CrudQueryDto extends PaginateQuery{
    relations:string[]
}