import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, ValidationPipeOptions, Type } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BaseModel } from '../entities/base-model.entity';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class CrudValidationPipe<TEntity extends ObjectLiteral> extends ValidationPipe {

  constructor(protected type:Type<TEntity>,
    options?:ValidationPipeOptions){
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    return await super.transform(value, {...metadata, metatype: this.type});
  }

}