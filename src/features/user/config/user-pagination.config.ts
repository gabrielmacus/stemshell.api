import { PaginateConfig } from "nestjs-paginate";
import { User } from "../entities/user.entity";

export const UserPaginationConfig:PaginateConfig<User> = {
    sortableColumns:['id','username','createdAt'],
    maxLimit:+process.env.PAGINATION_DEFAULT_LIMIT!,
    filterableColumns:{
        id:true,
        createdAt:true,
        deleted_at:true,
        username:true,
        "sessions.id":true
    }
}