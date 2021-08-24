import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { IEvent } from '../interfaces/event.interface';

export class updateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<IEvent>;
}
