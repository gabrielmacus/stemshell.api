import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '../../crud/entities/base-model.entity';
import { Matches } from 'class-validator';
import { Session } from '../../session/entities/session.entity';

@Entity()
export class User extends BaseModel {

    @Column({ type: 'varchar', length: 100, unique:true })
    username: string;

    //TODO: Modularize (decouple)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @Column({ type: 'varchar', length: 100, unique:true })
    password: string;

    @OneToMany(()=>Session, (session)=>session.user)
    sessions: Session[]

    
}

