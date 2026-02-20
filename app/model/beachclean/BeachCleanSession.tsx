import { printDateShort } from '../../components/utils/PrettyPrinter';
import { I18n } from 'i18n-js/typings';
import Signature from '../Signature';
import Trash from './Trash';
import DateTime from '../DateTime';

export default class BeachCleanSession {
  id: string;
  type: string;
  items: Trash[];
  startDate?: number;
  endDate?: number;
  numberOfPeople?: number;
  location?: string;
  totalWeightInKg?: string;
  additionalNotes: string;
  synced: boolean;
  signature?: Signature;

  constructor(id: string) {
    this.id = id;
    this.type = 'BeachCleanSession';
    this.items = [];
    this.additionalNotes = '';
    this.synced = false;
  }

  public add(item: Trash) {
    this.items.push(item);
  }

  public signed(): boolean {
    return this.signature !== undefined && this.signature.token !== undefined;
  }

  public logo(): string {
    return '🗑️';
  }

  public printCoordinates(i18n: I18n): string {
    let location = this.location;
    let datetime = null;
    if (this.startDate) {
      datetime = DateTime(new Date(this.startDate));
    }

    if (datetime && location) {
      return `${printDateShort(datetime, i18n)} ${location}`;
    } else if (datetime) {
      return `${printDateShort(datetime, i18n)}`;
    } else if (location) {
      return location;
    }

    return '';
  }

  public printDetails(i18n: I18n): string {
    if (this.totalWeightInKg) {
      return `${this.items.length} ${i18n.t('ITEMS')} (${this.totalWeightInKg} kg)`;
    } else {
      return `${this.items.length} ${i18n.t('ITEMS')}`;
    }
  }
};