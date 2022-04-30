type Image = {
  filename: string,
  location: string,
  uploaded: boolean,
  link: string
};

function Image(filename: string, location: string): Image {
  return {
    filename: filename,
    location: location,
    uploaded: false,
    link: undefined
  }
}

export default Image;
