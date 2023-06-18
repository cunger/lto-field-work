import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { InputLabel, InputGroup } from './Input';
import SelectField from './SelectField';
import Location from '../../model/Location';
import GlobalContext from '../../context/GlobalContext';
import { useTailwind } from 'tailwind-rn';

function Coordinates({ inputDate, inputLocation, setDateOnParent, setLocationOnParent }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;
  
  const [date, setDate] = useState(inputDate);
  const [year, setYear] = useState(inputDate.year);
  const [month, setMonth] = useState(inputDate.month);
  const [day, setDay] = useState(inputDate.day);
  const [hours, setHours] = useState(inputDate.hours);
  const [minutes, setMinutes] = useState(inputDate.minutes);
  const [location, setLocation] = useState(inputLocation);

  const saveYear = (year: number) => {
    setYear(year);
    date.year = year;
    setDate(date);
    setDateOnParent(date);
  };

  const saveMonth = (month: number) => {
    setMonth(month);
    date.month = month;
    setDate(date);
    setDateOnParent(date);
  };

  const saveDay = (day: number) => {
    setDay(day);
    date.day = day;
    setDate(date);
    setDateOnParent(date);
  };

  const saveHours = (hours: number) => {
    setHours(hours);
    date.hours = hours;
    setDate(date);
    setDateOnParent(date);
  };

  const saveMinutes = (minutes: number) => {
    setMinutes(minutes);
    date.minutes = minutes;
    setDate(date);
    setDateOnParent(date);
  };

  const saveLocation = (location: Location) => {
    setLocation(location);
    setLocationOnParent(location);
  };

  const itemRange = (start: number, end: number) => {
    let items = [];
    for (let i = start; i <= end; i++) {
      items.push({ label: i < 10 ? `0${i}` : `${i}`, value: i });
    }

    return items;
  }

  const yearRange = () => {
    const thisYear = new Date().getFullYear();
    return itemRange(thisYear - 10, thisYear + 1);
  }

  const monthRange = () => {
    let items = [];
    for (let i = 1; i <= 12; i++) {
      items.push({ label: i18n.t(`MONTH_${i}`), value: i });
    }

    return items;
  }

  const dayRange = (month: number) => {
    // TODO february
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return itemRange(1, 31);
    } else {
      return itemRange(1, 30);
    }
  }

  return (
    <SafeAreaView>
      <View style={tailwind('mb-2')}>
        <InputGroup text={i18n.t('COORDINATES')} />
        <View style={tailwind('flex flex-row items-stretch my-3')}>
          <InputLabel text={i18n.t('COORDINATES_DATE') + ': '} />
          <SelectField
            label={i18n.t('COORDINATES_DAY')}
            value={day}
            items={dayRange(month)}
            updateAction={(value: number) => saveDay(value)}
          />
          <SelectField
            label={i18n.t('COORDINATES_MONTH')}
            value={month}
            items={monthRange()}
            updateAction={(value: number) => saveMonth(value)}
          />
          <SelectField
            label={i18n.t('COORDINATES_YEAR')}
            value={year}
            items={yearRange()}
            updateAction={(value: number) => saveYear(value)}
          />
        </View>
        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <InputLabel text={i18n.t('COORDINATES_TIME') + ': '} />
          <SelectField
            label={i18n.t('COORDINATES_HOURS')}
            value={hours}
            items={itemRange(0, 23)}
            updateAction={(value: number) => saveHours(value)}
          />
          <SelectField
            label={i18n.t('COORDINATES_MINUTES')}
            value={minutes}
            items={itemRange(0, 59)}
            updateAction={(value: number) => saveMinutes(value)}
          />
        </View>

        <InputLabel text={i18n.t('COORDINATES_LOCATION')} />
        <SelectField
          label={i18n.t('COORDINATES_WHICH_BAY')}
          value={location}
          type={Location}
          updateAction={(value: Location) => saveLocation(value)}
        />
      </View>
    </SafeAreaView>
  );
}

export default Coordinates;
