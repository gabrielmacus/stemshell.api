import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../crud/base-model.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseModel {

    @Column({ type: 'varchar', length: 100, unique:true })
    username: string;

    @Exclude()
    @Column({ type: 'varchar', length: 100 })
    password: string;

    
}

