import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  constructor() {}
  transform(value: object, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    console.log({ value, metadata }); // Debug log

    const validateOne = async (item: object) => {
      if (!metadata.metatype) {
        throw new InternalServerErrorException('No validation schema provided');
      }

      const instance = plainToInstance(metadata.metatype, item);
      const errors = await validate(instance);
      if (errors.length > 0) {
        throw new BadRequestException([
          ...errors.map((e) => Object.values(e.constraints || {})).flat(),
        ]);
      }

      return instance;
    };

    if (Array.isArray(value)) {
      return Promise.all(value.map(validateOne));
    }

    return validateOne(value);
  }
}
