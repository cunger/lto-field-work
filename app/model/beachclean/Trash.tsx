import 'react-native-get-random-values';
import Item from '../Item';
import Category from './Category';
import Location from '../Location';

export default class Trash extends Item {
  quantity: number = 0;
  category: Category = Category.Other;

  constructor(date: Date, location: Location | null, category: Category, quantity: number) {
    super('Trash', date, location);
    this.category = category;
    this.quantity = quantity;
  }
};
