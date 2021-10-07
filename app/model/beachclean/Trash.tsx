import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Category from './Category';

function Trash() {
  return {
    id: uuid(),
    type: 'Trash',
    synced: false,
    signature: undefined,
    date: new Date(),
    location: Location.Guinjata,
    quantity: 1,
    category: Category.Unknown,
  };
}

export default Trash;
