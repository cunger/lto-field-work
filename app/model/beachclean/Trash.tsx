import 'react-native-get-random-values';
import Item from '../Item';
import Category from './Category';
import Location from '../Location';

export default class Trash extends Item {
  quantity: number = 0;
  category: Category = Category.Other;

  constructor(date: number, location: Location | null, category: Category, quantity: number, additionalNotes?: '') {
    super('Trash', date, location, additionalNotes);
    this.category = category;
    this.quantity = quantity;
  }
};
