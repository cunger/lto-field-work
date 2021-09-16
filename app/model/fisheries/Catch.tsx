import Location from './Location';
import Species from './Species';

function Catch() {
  return {
    date: new Date(),
    location: Location.Guinjata,
    quantity: 1,
    species: Species.Unknown,
    size: 0,
    picture: undefined,
  };
}

export default Catch;
