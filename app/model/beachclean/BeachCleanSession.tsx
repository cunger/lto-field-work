import Session from '../Session';
import Location from '../Location';
import Trash from './Trash';

export default class BeachCleanSession extends Session {
  items: Trash[];
  totalWeightInKg: number | undefined;
  numberOfPeople: number | undefined;
 
  constructor(id: string, startDate: number, endDate: number, location: Location | null, trashItems?: Trash[], additionalNotes?: string, totalWeightInKg?: number, numberOfPeople?: number) {
    super('BeachClean', id, startDate, endDate, location, additionalNotes);
    this.items = trashItems ?? [];
    this.totalWeightInKg = totalWeightInKg;
    this.numberOfPeople = numberOfPeople;
  }

  public add(item: Trash) {
    this.items.push(item);
  }
};