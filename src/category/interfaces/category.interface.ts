import { EventInterface } from './event.interface';

export interface CategoryInterface {
  readonly _id: string;
  readonly category: string;
  description: string;
  events: Array<EventInterface>;
}
