import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export const StringRequired = (name: string) => {
  return applyDecorators(
    ApiProperty({
      required: true,
    }),
    IsString({ message: `${name} must be a string` }),
    IsNotEmpty({ message: `${name} is required` }),
  );
};

export const StringNotRequired = applyDecorators(
  ApiProperty({
    required: false,
  }),
  IsString(),
  IsOptional(),
);

export const NumberNotRequired = applyDecorators(
  ApiProperty({
    required: false,
  }),
  IsNumber(),
  IsOptional(),
  Type(() => Number),
);

export const BooleanNotRequired = applyDecorators(
  ApiProperty({
    required: false,
  }),
  IsBoolean(),
  IsOptional(),
);
