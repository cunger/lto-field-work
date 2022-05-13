import 'react-native-get-random-values';
import Item from '../Item';
import Location from '../Location';
import Species from './Species';
import Sex from './Sex';
import Method from './Method';
import Base from './Base';

export default class Catch extends Item {
  reason?: String;
  method?: Method | string;
  base?: Base;
  quantity: number;
  common_name: string;
  species: Species | null;
  sex: Sex | null;
  length?: number;
  weight?: number;
  fork_length?: number;
  tail_length?: number;
  head_length?: number;
  head_width?: number;
  precaudal_length?: number;
  carapace_width?: number;
  carapace_length?: number;
  wingspan?: number;

  constructor(date: Date, location: Location | null) {
    super('Catch', date, location);
    this.quantity = 1;
    this.common_name = '';
    // Set all those properties to null which you want to reset after saving a catch 
    this.species = null; 
    this.sex = null;
    // this.method = null;
    // this.base = null;
  }
};
