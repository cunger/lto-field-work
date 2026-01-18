import Location from '../Location';
import Catch from './Catch';
import Signature from '../Signature';
import { printDateShort } from '../../components/utils/PrettyPrinter';
import { I18n } from 'i18n-js/typings';

export default class FisheriesSession {
  id: string;
  startDate: number;
  endDate: number;
  location: Location | null;
  items: Catch[];
  reason?: String;
  additionalNotes: string;
  synced: boolean;
  signature?: Signature;
 
  constructor(id: string, startDate: number, endDate: number, location: Location | null, items?: Catch[], reason?: string, additionalNotes?: string) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.items = items ?? [];
    this.reason = reason;
    this.additionalNotes = additionalNotes ?? '';
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
      datetime = new DateTime(new Date(this.startDate));
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