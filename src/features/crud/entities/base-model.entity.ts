import { CreateDateColumn, DeleteDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseModel{
  @PrimaryGeneratedColumn()
  id:number

  @CreateDateColumn()
  created_at:Date

  @UpdateDateColumn()
  updated_at:Date

  @Index()
  @DeleteDateColumn()
  deleted_at:Date
}