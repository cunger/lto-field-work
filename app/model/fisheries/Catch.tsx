import 'react-native-get-random-values';
import Item from '../Item';
import Location from '../Location';
import Species from './Species';
import Sex from './Sex';
import Method from './Method';
import Base from './Base';

class Dimensions {
  total: string;
  min: string;
  max: string;

  constructor() {
    this.total = '';
    this.min = '';
    this.max = '';
  }
}

export default class Catch extends Item {
  reason?: String;
  method?: Method;
  other_method?: string;
  base?: Base;
  quantity: number;
  common_name: string;
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

  constructor(date: Date, location: Location | null, base?: Base, method?: Method, other_method?: string) {
    super('Catch', date, location);
    this.quantity = 1;
    this.common_name = '';
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
  }
};
