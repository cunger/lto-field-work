type Image = {
  filename: string,
  type: string,
  uri: string,
};

function Image(filename: string, type: string, uri: string): Image {
  return {
    filename: filename,
    type: type,
    uri: uri,
  }
}

export default Image;
