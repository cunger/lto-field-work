import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Species from './Species';

function Catch() {
  return {
    id: uuid(),
    type: 'Catch',
    synced: false,
    signature: undefined,
    date: new Date(),
    location: Location.Guinjata,
    method: undefined,
    quantity: 1,
    species: undefined,
    size: undefined,
    picture: undefined,
  };
}

export default Catch;
