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
  events: Array<EventInterface>;
}
