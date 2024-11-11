import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RecoverEvent, DataSource, UpdateEvent, TransactionCommitEvent } from "typeorm";
import { Inject } from "@nestjs/common";
import { Session } from "./entities/session.entity";
import { BeforeQueryEvent } from "typeorm/subscriber/event/QueryEvent";

// https://stackoverflow.com/questions/58918644/nestjs-cannot-inject-a-service-into-a-subscriber
@EventSubscriber()
export class SessionSubscriber implements EntitySubscriberInterface<Session> {
    
    constructor(
        //@Inject(DataSource) dataSource: DataSource
    ){
        //dataSource.subscribers.push(this);
    }

    listenTo(): Function | string {
        return Session;
    }
    

    beforeInsert(event: InsertEvent<Session>): Promise<any> | void {
        event.entity.userId = JSON.parse(event.entity.json).passport.user.id as number
    }
    /*
    beforeRecover(event: RecoverEvent<Session>): Promise<any> | void {
        console.log("asdasdsa")
    }
    beforeQuery(event: BeforeQueryEvent<Session>): Promise<any> | void {
        console.log("adas")
    }

    beforeTransactionCommit(event: TransactionCommitEvent): Promise<any> | void {
        console.log("gfhdiuiuhgfdhufgd")
    }

    afterInsert(event: InsertEvent<Session>): Promise<any> | void {
        console.log("caca")
    }

    beforeUpdate(event: UpdateEvent<Session>): Promise<any> | void {
        console.log("pichí")
    }*/


}