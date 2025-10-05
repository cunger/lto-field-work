import uuid from 'react-native-uuid';
import DateTime from './DateTime';
import { print, printDateShort } from '../components/utils/PrettyPrinter';
import Category from '../model/beachclean/Category';
import { I18n } from 'i18n-js/typings';

export default class Item {
  type: string;
  id: string;
  sessionId: string;
 
  constructor(type: string, sessionId: string) {
    this.type = type;
    this.id = uuid.v4();
    this.sessionId = sessionId;
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
    let datetime = null;
    if (item.date) {
      datetime = new DateTime(new Date(item.date));
    }

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