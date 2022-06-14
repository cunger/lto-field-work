import 'react-native-get-random-values';
import Item from '../Item';
import Location from '../Location';
import Species from './Species';
import Sex from './Sex';
import Method from './Method';
import Base from './Base';

export default class Catch extends Item {
  reason?: String;
  method?: Method;
  other_method?: string;
  base?: Base;
  quantity: number;
  common_name: string;
  species: Species | null;
  sex: Sex | null;
  length?: number;
  max_length?: number;
  min_length?: number;
  weight?: number;
  fork_length?: number;
  tail_length?: number;
  head_length?: number;
  head_width?: number;
  precaudal_length?: number;
  carapace_width?: number;
  carapace_length?: number;
  wingspan?: number;

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

  }
};
