import { v4 as uuid } from 'uuid';
import Signature from './Signature';
import Location from './Location';
import Image from './Image';

export default class Item {
  id: string;
  type: string;
  synced: boolean;
  signature?: Signature;
  date: Date;
  location: Location | null;
  photos: Image[];
  photosNote: string;

  constructor(type: string, date: Date, location: Location | null) {
    this.id = uuid();
    this.type = type;
    this.date = date;
    this.location = location;
    this.synced = false;
    this.photos = [];
    this.photosNote = '';
  }
};