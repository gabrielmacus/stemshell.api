import { PaginateConfig } from "nestjs-paginate";
import { Session } from "../entities/session.entity";

export const SessionPaginationConfig:PaginateConfig<Session> = {
    sortableColumns:['id','json','expiredAt','destroyedAt','userId'],
    maxLimit:+process.env.PAGINATION_DEFAULT_LIMIT!,
    filterableColumns:{
        id:true,
        expiredAt:true,
        destroyedAt:true,
        userId:true
    }

}