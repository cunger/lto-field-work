type DateTime = {
  day: number,
  month: number,
  year: number,
  hours: number,
  minutes: number,
  toEpoch: () => number,
};

function DateTime(date: Date | undefined): DateTime {
  if (!date) date = new Date();

  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    toEpoch() { 
      return new Date(this.year, this.month - 1, this.day, this.hours, this.minutes).getTime();
    }
  }
}

export default DateTime;
