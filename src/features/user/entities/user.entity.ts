import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../crud/entities/base-model.entity';
import { Exclude } from 'class-transformer';
import { Matches } from 'class-validator';

@Entity()
export class User extends BaseModel {

    @Column({ type: 'varchar', length: 100, unique:true })
    username: string;

    @Exclude({ toPlainOnly:true })
    //TODO: Modularize (decouple)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    password: string;

    
}

