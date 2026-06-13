import { I18n } from 'i18n-js/typings';
import Image from '../Image';
import Species from './Species';
import Sex from './Sex';
import Method from './Method';
import Base from './Base';
import Signature from '../Signature';
import { printDateShort } from '../../components/utils/PrettyPrinter';
import DateTime from '../DateTime';

class Dimensions {
  total: string;
  min: string;
  max: string;
  avg: string;

  constructor() {
    this.total = '';
    this.min = '';
    this.max = '';
    this.avg = '';
  }
}

export default class Catch {
  id: string;
  type: string;
  sessionId?: string;
  date?: number;
  location?: string;
  reason?: string;
  method?: Method;
  other_method?: string;
  base?: Base;
  quantity: number;
  common_name: string;
  latin_name: string;
  species: Species | null;
  sex: Sex | null;
  length: Dimensions;
  fork_length: Dimensions;
  tail_length: Dimensions;
  head_length: Dimensions;
  head_width: Dimensions;
  precaudal_length: Dimensions;
  carapace_length: Dimensions;
  carapace_width: Dimensions;
  disk_width: Dimensions;
  photos: Image[];
  photosNote: string;
  synced: boolean;
  signature?: Signature;

  constructor(id: string, base?: Base, method?: Method, other_method?: string) {
    this.id = id;
    this.type = 'Catch';
    this.quantity = 1;
    this.common_name = '';
    this.latin_name = '';
    this.reason = '';
    // We don't want to reset these fields, as they usually don't change.
    this.base = base;
    this.method = method;
    this.other_method = other_method;
    // Set those properties to null which you want to reset after saving a catch.
    this.species = null;
    this.sex = null;
    // Dimensions
    this.length = new Dimensions();
    this.fork_length = new Dimensions();
    this.tail_length = new Dimensions();
    this.head_length = new Dimensions();
    this.head_width = new Dimensions();
    this.precaudal_length = new Dimensions();
    this.carapace_width = new Dimensions();
    this.carapace_length = new Dimensions();
    this.disk_width = new Dimensions();
    // Photos
    this.photos = [];
    this.photosNote = '';
    // Has it been uploaded?
    this.synced = false;
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
    if (this.date) {
      datetime = DateTime(new Date(this.date));
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
    return '';
  }
};
