import { v4 as uuid } from 'uuid';
import Location from './Location';
import Species from './Species';

function Catch() {
  return {
    id: uuid(),
    type: 'Catch',
    signature: undefined,
    date: new Date(),
    location: Location.Guinjata,
    quantity: 1,
    species: Species.Unknown,
    size: 0,
    picture: undefined,
  };
}

export default Catch;
