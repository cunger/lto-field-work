import Signature from './Signature';
import Location from './Location';
import DateTime from './DateTime';
import { I18n } from 'i18n-js/typings';
import { printDateShort } from '../components/utils/PrettyPrinter';

export default class Session {
  id: string;
  type: 'BeachClean' | 'Fisheries';
  startDate: number;
  endDate: number;
  location: Location | null;
  additionalNotes: string;
  synced: boolean;
  signature?: Signature;
 
  constructor(type: 'BeachClean' | 'Fisheries', id: string, startDate: number, endDate: number, location: Location | null, additionalNotes?: string) {
    this.id = id;
    this.type = type;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.additionalNotes = additionalNotes ?? '';
    this.synced = false;
  }

  public signed(): boolean {
    return !!(this.signature && this.signature.token);
  }

  public static logoFor(session: Session): string {
    switch (session.type) {
      case 'Fisheries': return '🎣';
      case 'BeachClean': return '🗑️';
      default: return ' ';
    }
  }

  public static printDetails(session: Session, i18n: I18n): string {
    let location = session.location;
    let datetime = null;
    if (session.startDate) {
      datetime = new DateTime(new Date(session.startDate));
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