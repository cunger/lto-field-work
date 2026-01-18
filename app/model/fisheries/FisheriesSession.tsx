import { printDateShort } from '../../components/utils/PrettyPrinter';
import { I18n } from 'i18n-js/typings';
import Location from '../Location';
import Catch from './Catch';
import Signature from '../Signature';
import DateTime from '../DateTime';

export default class FisheriesSession {
  id: string;
  type: string;
  items: Catch[];
  startDate?: number;
  endDate?: number;
  location?: Location;
  reason?: String;
  additionalNotes: string;
  synced: boolean;
  signature?: Signature;
 
  constructor(id: string) {
    this.id = id;
    this.type = 'FisheriesSession';
    this.items = [];
    this.additionalNotes = '';
    this.synced = false;
  }

  public add(item: Catch) {
    this.items.push(item);
  }

  public signed(): boolean {
    return this.signature !== undefined && this.signature.token !== undefined;
  }

  public logo(): string {
    return '🐠';
  }

  public printCoordinates(i18n: I18n): string {
    let location = this.location;
    let datetime = null;
    if (this.startDate) {
      datetime = DateTime(new Date(this.startDate));
    }

    if (datetime && location) {
      return `${printDateShort(datetime, i18n)} ${i18n.t(location)}`;
    } else if (datetime) {
      return `${printDateShort(datetime, i18n)}`;
    } else if (location) {
      return `${i18n.t(location)}`;
    }

    return '';
  }

  public printDetails(i18n: I18n): string {
    return `${this.items.length} ${i18n.t('CATCHES')}`;
  }
};