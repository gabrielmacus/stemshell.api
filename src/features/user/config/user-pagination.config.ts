import { PaginateConfig } from "nestjs-paginate";
import { User } from "../entities/user.entity";

export const UserPaginationConfig:PaginateConfig<User> = {
    sortableColumns:['id','username','created_at'],
    maxLimit:+process.env.PAGINATION_DEFAULT_LIMIT!,
    select:['id','username','created_at'],
    filterableColumns:{
        id:true,
        created_at:true,
        deleted_at:true,
        username:true
    }
}