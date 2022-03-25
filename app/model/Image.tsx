type Image = {
  filename: string,
  base64data: string,
  description: string
};

function Image(filename, base64data, description): Image {
  return {
    filename: filename,
    base64data: base64data || '',
    description: description || ''
  }
}

export default Image;
