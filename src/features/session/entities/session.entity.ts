import { BeforeInsert, Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ISession } from 'connect-typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Session implements ISession {
    @Index()
    @Column("bigint")
    public expiredAt = Date.now();

    @PrimaryColumn("varchar", { length: 255 })
    public id = "";

    @Column("text")
    public json = "";

    @DeleteDateColumn()
    public destroyedAt?: Date;

    @ManyToOne(() => User, (user)=>user.sessions)
    @JoinColumn({referencedColumnName:'id',name:'userId'})
    public user:User

    @Index()
    @Column({type:'bigint'})
    public userId: number;
   
}

