import uuid from 'react-native-uuid';
import { print } from '../components/utils/PrettyPrinter';
import Category from '../model/beachclean/Category';
import { I18n } from 'i18n-js/typings';
import Catch from './fisheries/Catch';
import Trash from './beachclean/Trash';

export default class Item {
  type: string; // 'Catch' | 'Trash'
  id: string;
  sessionId: string;
  synced: boolean;
 
  constructor(type: string, sessionId: string) {
    this.type = type;
    this.id = uuid.v4();
    this.sessionId = sessionId;
    this.synced = false;
  }

  public static prettyPrint(item: Item, i18n: I18n): string {
    switch (item.type) {
      case 'Catch': {
        const c = item as Catch;
        return print(c.quantity, c.species || c.common_name || 'SPECIES_Fish', i18n, 'NO_CATCH');
      }
      case 'Trash': {
        const t = item as Trash;
        return print(t.quantity, Category[t.category], i18n);
      }
      default: return 'SOMETHING';
    }
  }
};