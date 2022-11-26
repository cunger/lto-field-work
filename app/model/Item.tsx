import { v4 as uuid } from 'uuid';
import Signature from './Signature';
import Location from './Location';
import Image from './Image';
import { print } from '../components/utils/PrettyPrinter';
export default class Item {
  id: string;
  type: string;
  synced: boolean;
  signature?: Signature;
  date: Date;
  location: Location | null;
  photos: Image[];
  photosNote: string;
  additionalNotes: string;
 
  constructor(type: string, date: Date, location: Location | null, additionalNotes?: string) {
    this.id = uuid();
    this.type = type;
    this.date = date;
    this.location = location;
    this.synced = false;
    this.photos = [];
    this.photosNote = '';
    this.additionalNotes = additionalNotes || '';
  }

  public static signed(item: Item): boolean {
    return !!(item.signature && item.signature.token);
  }

  public static prettyPrint(item: Item): string {
    switch (item.type) {
      case 'Catch': return print(item.quantity, item.common_name || item.species || 'fish');
      case 'Trash': return print(item.quantity, item.category);
      default: return 'something';
    }
  }

  public static logoFor(item: Item): string {
    switch (item.type) {
      case 'Catch': return '🎣';
      case 'Trash': return '🗑️';
      default: return ' ';
    }
  }

  public static printDetails(item: Item): string {
    let location = item.location;
    let date = item.date;
    if (date && typeof date == 'string') {
      date = new Date(date);
    }

    if (date && location) {
      return `(${date.toLocaleDateString()}, ${location})`;
    } else if (date) {
      return `(${date.toLocaleDateString()})`;
    } else if (location) {
      return `(${location})`;
    }

    return '';
  }
};