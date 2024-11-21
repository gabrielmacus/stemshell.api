import { CreateDateColumn, DeleteDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseModel{
  //JS no puede manejar correctamente bigints como number
  @PrimaryGeneratedColumn({type:'bigint'})
  id:string

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt?:Date

  @Index()
  @DeleteDateColumn()
  deletedAt?:Date
}