export default class Image {
  filename: string;
  location: string;
  uploaded: boolean;
  link?: string;

  constructor(filename: string, location: string) {
    this.filename = filename;
    this.location = location;
    this.uploaded = false;
  }
};
