import { v4 as uuid } from 'uuid';
import Signature from './Signature';
import Location from './Location';
import DateTime from './DateTime';
import Image from './Image';
import { print, printDateShort } from '../components/utils/PrettyPrinter';
import Category from '../model/beachclean/Category';
import { I18n } from 'i18n-js/typings';

export default class Item {
  id: string;
  type: string;
  synced: boolean;
  signature?: Signature;
  date: number;
  location: Location | null;
  photos: Image[];
  photosNote: string;
  additionalNotes: string;
 
  constructor(type: string, date: number, location: Location | null, additionalNotes?: string) {
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

  public static prettyPrint(item: Item, i18n: I18n): string {
    switch (item.type) {
      case 'Catch': return print(item.quantity, item.species || item.common_name || 'SPECIES_Fish', i18n, 'NO_CATCH');
      case 'Trash': return print(item.quantity, Category[item.category], i18n);
      default: return 'SOMETHING';
    }
  }

  public static logoFor(item: Item): string {
    switch (item.type) {
      case 'Catch': return '🎣';
      case 'Trash': return '🗑️';
      default: return ' ';
    }
  }

  public static printDetails(item: Item, i18n: I18n): string {
    let location = item.location;
    let datetime = item.date ? new DateTime(new Date(item.date)) : null;

    if (datetime && location) {
      return `(${printDateShort(datetime, i18n)} ${i18n.t(location)})`;
    } else if (datetime) {
      return `(${printDateShort(datetime, i18n)})`;
    } else if (location) {
      return `(${i18n.t(location)})`;
    }

    return '';
  }
};