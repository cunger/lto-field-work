import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Category from './Category';

function Trash(props) {
  console.log(JSON.stringify(props));
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
