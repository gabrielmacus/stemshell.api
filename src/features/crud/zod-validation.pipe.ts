
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(/*private schema: ZodSchema*/) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log(metadata)
    return value;
    /*
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }*/
  }
}
