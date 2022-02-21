import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Species from './Species';
import Sex from './Sex';
import Method from './Method';
import Base from './Base';

type Catch = {
  id: string,
  type: string,
  synced: boolean,
  signature: Signature,
  date: date,
  location: Location,
  method: Method,
  base: Base,
  quantity: number,
  species: Species,
  common_name: string,
  sex: Sex,
  length: number,
  weight: number,
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
    base: undefined,
    quantity: 1,
    species: undefined,
    common_name: undefined,
    sex: Sex.Unknown,
    length: undefined,
    weight: undefined,
    picture_filename: undefined,
    picture_data: undefined,
  };
}

export default Catch;
