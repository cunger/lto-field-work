import { printDateShort } from '../../components/utils/PrettyPrinter';
import { I18n } from 'i18n-js/typings';
import Signature from '../Signature';
import DateTime from '../DateTime';

export default class FisheriesSession {
  id: string;
  type: string;
  startDate?: number;
  endDate?: number;
  location?: string;
  reason?: string;
  additionalNotes: string;
  numberOfPeople?: number;
  synced: boolean;
  signature?: Signature;
 
  constructor(id: string) {
    this.id = id;
    this.type = 'FisheriesSession';
    this.additionalNotes = '';
    this.synced = false;
  }

  public signed(): boolean {
    return this.signature !== undefined && this.signature.token !== undefined;
  }

  public logo(): string {
    return '⏱️';
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
    let hours;
    let minutes;
    if (this.startDate && this.endDate) {
      const diffMinutes = (this.endDate - this.startDate) / 60000;
      hours = Math.floor(diffMinutes / 60);
      minutes = diffMinutes - hours * 60;
      return `${hours} h ${minutes} min`;
    } else {
      return '';
    }
  }
};