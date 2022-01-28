import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Category from './Category';

type Trash = {
  id: string,
  type: string,
  synced: boolean,
  signature: string,
  date: date,
  location: Location,
  quantity: number,
  category: Category,
};

function Trash(props: { date: date, location: Location, quantity: 0, category: Category}): Trash {
  return {
    id: uuid(),
    type: 'Trash',
    synced: false,
    signature: undefined,
    date: props.date || new Date(),
    location: props.location || Location.Guinjata,
    quantity: props.quantity || 0,
    category: props.category || Category.Unknown,
  };
}

export default Trash;
