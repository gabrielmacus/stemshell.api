import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RecoverEvent, LoadEvent, DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Inject } from "@nestjs/common";
import { UserService } from "./user.service";

// https://stackoverflow.com/questions/58918644/nestjs-cannot-inject-a-service-into-a-subscriber
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    
    constructor(
        @Inject(UserService)
        protected userService:UserService,
        @Inject(DataSource) dataSource: DataSource
    ){
        dataSource.subscribers.push(this);
    }

    listenTo(): Function | string {
        return User;
    }



    async beforeInsert(event: InsertEvent<User>): Promise<any> {
        event.entity.password = await this.userService.hashPassword(event.entity.password);
    }
}