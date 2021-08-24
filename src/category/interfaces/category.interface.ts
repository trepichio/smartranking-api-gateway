import { IEvent } from './event.interface';

export interface ICategory {
  readonly _id: string;
  readonly category: string;
  description: string;
  events: Array<IEvent>;
}
