import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import Location from '../Location';
import Image from '../Image';
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
  reason: String,
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
  photos: Image[],
  photosNote: string
};

function Catch(date, location): Catch {
  return {
    id: uuid(),
    type: 'Catch',
    synced: false,
    date: date,
    location: location,
    quantity: 1,
    species: null,
    sex: null,
    // method: null, // comment in if you want to reset this after saving a catch
    // base: null,   // dito
    common_name: '',
    photos: [],
    photosNote: ''
  };
}

export default Catch;
