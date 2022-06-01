import mime from 'mime';

export default class Image {
  filename: string;
  location: string;
  mimetype: string;
  link?: string;

  constructor(filename: string, location: string) {
    this.filename = filename;
    this.location = location;
    this.mimetype = mime.getType(location);
  }
};
