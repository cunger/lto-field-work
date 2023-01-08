import { v4 as uuid } from 'uuid';
import Signature from './Signature';
import Location from './Location';
import Image from './Image';
import { print } from '../components/utils/PrettyPrinter';
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
      case 'Catch': return print(item.quantity, item.species || 'SPECIES_Fish', i18n, 'NO_CATCH');
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
    let locale = i18n.locale;
    if (locale == 'en') {
      locale = 'en-UK';
    }

    let location = item.location;
    let date = item.date;

    if (date && location) {
      return `(${new Date(date).toLocaleDateString(locale, { dateStyle: 'short' })}, ${i18n.t(location)})`;
    } else if (date) {
      return `(${new Date(date).toLocaleDateString(locale, { dateStyle: 'short' })})`;
    } else if (location) {
      return `(${location})`;
    }

    return '';
  }
};