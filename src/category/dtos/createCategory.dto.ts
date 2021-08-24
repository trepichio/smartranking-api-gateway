import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { EventInterface } from '../interfaces/event.interface';

export class createCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }): EventInterface[] =>
    value.map((event) =>
      Object.assign(event, {
        name: event.name.toUpperCase(),
      }),
    ),
  )
  events: Array<EventInterface>;
}
