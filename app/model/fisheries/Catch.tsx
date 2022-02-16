import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Species from './Species';
import Method from './Method';

type Catch = {
  id: string,
  type: string,
  synced: boolean,
  signature: Signature,
  date: date,
  location: Location,
  method: Method,
  quantity: number,
  species: Species,
  size: number,
  picture_filename: string,
  picture_data: string,
};

function Catch(): Catch {
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
    picture_filename: undefined,
    picture_data: undefined,
  };
}

export default Catch;
