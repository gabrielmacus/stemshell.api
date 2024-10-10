import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../crud/base-model.entity';

@Entity()
export class User extends BaseModel {

    @Column({ type: 'varchar', length: 100, unique:true })
    username: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    
}

