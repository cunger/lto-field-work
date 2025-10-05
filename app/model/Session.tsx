import Signature from './Signature';
import Location from './Location';

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
};