import uuid from 'react-native-uuid';
import Signature from './Signature';
import Location from './Location';

export default class BeachCleanSession {
  id: string;
  startDate: number;
  endDate: number;
  location: Location | null;
  additionalNotes: string;
  totalWeightInKg: number | undefined;
  numberOfPeople: number | undefined;
  synced: boolean;
  signature?: Signature;
 
  constructor(startDate: number, endDate: number, location: Location | null, additionalNotes?: string, totalWeightInKg?: number, numberOfPeople?: number) {
    this.id = uuid.v4();
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.additionalNotes = additionalNotes || '';
    this.totalWeightInKg = totalWeightInKg;
    this.numberOfPeople = numberOfPeople;
    this.synced = false;
  }

  public static signed(session: BeachCleanSession): boolean {
    return !!(session.signature && session.signature.token);
  }
};