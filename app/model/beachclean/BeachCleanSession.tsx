import { printDateShort } from '../../components/utils/PrettyPrinter';
import { I18n } from 'i18n-js/typings';
import Location from '../Location';
import Signature from '../Signature';
import Trash from './Trash';

export default class BeachCleanSession {
  id: string;
  startDate: number;
  endDate: number;
  location: Location | null;
  items: Trash[];
  totalWeightInKg: number | undefined;
  numberOfPeople: number | undefined;
  additionalNotes: string;
  synced: boolean;
  signature?: Signature;

  constructor(id: string, startDate: number, endDate: number, location: Location | null, trashItems?: Trash[], additionalNotes?: string, totalWeightInKg?: number, numberOfPeople?: number) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.items = trashItems ?? [];
    this.totalWeightInKg = totalWeightInKg;
    this.numberOfPeople = numberOfPeople;
    this.additionalNotes = additionalNotes ?? '';
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
    if (this.totalWeightInKg) {
      return `${this.items.length} ${i18n.t('ITEMS')} (${this.totalWeightInKg} kg)`;
    } else {
      return `${this.items.length} ${i18n.t('ITEMS')}`;
    }
  }
};