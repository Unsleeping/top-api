import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATION_ERROR } from './id-validation.constants';

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }

    if (this.isIdValid(value)) {
      return value;
    }

    throw new BadRequestException(ID_VALIDATION_ERROR);
  }

  private isIdValid(value: string) {
    return Types.ObjectId.isValid(value);
  }
}
