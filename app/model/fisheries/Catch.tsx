import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Reason from './Reason';
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
  reason: Reason,
  method: Method,
  base: Base,
  quantity: number,
  species: Species,
  common_name: string,
  sex: Sex,
  length: number,
  weight: number,
  fork_length: number,
  tail_length: number,
  head_length: number,
  head_width: number,
  precaudal_length: number,
  carapace_width: number,
  carapace_length: number,
  wingspan: number,
  picture_filename: string,
  picture_data: string,
};

function Catch(): Catch {
  return {
    id: uuid(),
    type: 'Catch',
    synced: false,
    date: new Date(),
    quantity: 1,
  };
}

export default Catch;
