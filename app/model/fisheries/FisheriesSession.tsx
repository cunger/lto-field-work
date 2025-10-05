import Session from '../Session';
import Location from '../Location';
import Catch from './Catch';

export default class FisheriesSession extends Session {
  items: Catch[];
  reason?: String;
 
  constructor(id: string, startDate: number, endDate: number, location: Location | null, items?: Catch[], reason?: string, additionalNotes?: string) {
    super('Fisheries', id, startDate, endDate, location, additionalNotes);
    this.items = items ?? [];
    this.reason = reason;
  }

  public add(item: Catch) {
    this.items.push(item);
  }
};