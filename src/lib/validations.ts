import { registerDecorator, ValidationOptions } from 'class-validator';
import { IS_VALID_UNICODE } from '@/lib/consts';

export const IsValidUnicode =
  (property?: string, options?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: IS_VALID_UNICODE,
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: {
        message: 'unicode must be a valid unicode character',
        ...options,
      },
      validator: {
        validate: (value) => {
          if (typeof value === 'string') {
            const matches = value.match(
              /^\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*$/u,
            );
            return matches !== null && matches.length > 0;
          }

          return false;
        },
      },
    });
  };
