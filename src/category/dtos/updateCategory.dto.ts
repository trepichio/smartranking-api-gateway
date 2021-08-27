import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IEvent } from '../interfaces/event.interface';

export class updateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Event)
  @Transform(({ value }): IEvent[] =>
    value.map((event) =>
      Object.assign(event, {
        name: event.name.toUpperCase(),
      }),
    ),
  )
  events: Array<IEvent>;
}

class Event {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(['+', '-'])
  operation: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
