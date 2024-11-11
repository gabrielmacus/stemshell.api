import { CreateDateColumn, DeleteDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseModel{
  @PrimaryGeneratedColumn({type:'bigint'})
  id:number

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt:Date

  @Index()
  @DeleteDateColumn()
  deletedAt:Date
}