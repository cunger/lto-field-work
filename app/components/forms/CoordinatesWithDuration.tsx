import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputLabel, InputGroup } from './Input';
import SelectField from './SelectField';
import Location from '../../model/Location';
import GlobalContext from '../../context/GlobalContext';
import DateTime from '../../model/DateTime';

function CoordinatesWithDuration({ inputStartDate, inputEndDate, inputLocation, setStartDateOnParent, setEndDateOnParent, setLocationOnParent, resetTrigger }) {
  const i18n = GlobalContext.i18n;
  
  const [startDate, setStartDate] = useState(inputStartDate);
  const [endDate, setEndDate] = useState(inputEndDate);
  const [year, setYear] = useState(inputStartDate.year);
  const [month, setMonth] = useState(inputStartDate.month);
  const [day, setDay] = useState(inputStartDate.day);

  const [startHours, setStartHours] = useState(inputStartDate ? inputStartDate.hours : null);
  const [startMinutes, setStartMinutes] = useState(inputStartDate ? inputStartDate.minutes : null);
  const [endHours, setEndHours] = useState(inputEndDate ? inputEndDate.hours : null);
  const [endMinutes, setEndMinutes] = useState(inputEndDate ? inputEndDate.minutes : null);

  const [location, setLocation] = useState(inputLocation);

  const saveYear = (year: number) => {
    setYear(year);
    startDate.year = year;
    endDate.year = year;
    setStartDate(startDate);
    setStartDateOnParent(startDate);
    setEndDate(endDate);
    setEndDateOnParent(endDate);
  };

  const saveMonth = (month: number) => {
    setMonth(month);
    startDate.month = month;
    endDate.month = month;
    setStartDate(startDate);
    setStartDateOnParent(startDate);
    setEndDate(endDate);
    setEndDateOnParent(endDate);
  };

  const saveDay = (day: number) => {
    setDay(day);
    startDate.day = day;
    endDate.day = day;
    setStartDate(startDate);
    setStartDateOnParent(startDate);
    setEndDate(endDate);
    setEndDateOnParent(endDate);
  };

  const saveStartHours = (hours: number) => {
    setStartHours(hours);
    let newStartDate = startDate;
    if (newStartDate === null) {
      newStartDate = new DateTime();
      newStartDate.minutes = 0;
    }
    newStartDate.hours = hours;
    setStartDate(newStartDate);
    setStartDateOnParent(newStartDate);
  };

  const saveStartMinutes = (minutes: number) => {
    setStartMinutes(minutes);
    let newStartDate = startDate;
    if (newStartDate === null) {
      newStartDate = new DateTime();
    }
    newStartDate.minutes = minutes;
    setStartDate(newStartDate);
    setStartDateOnParent(newStartDate);
  };

  const saveEndHours = (hours: number) => {
    setEndHours(hours);
    let newEndDate = endDate;
    if (newEndDate === null) {
      newEndDate = new DateTime();
      newEndDate.minutes = 0;
    }
    newEndDate.hours = hours;
    setEndDate(newEndDate);
    setEndDateOnParent(newEndDate);
  };

  const saveEndMinutes = (minutes: number) => {
    setEndMinutes(minutes);
    let newEndDate = endDate;
    if (newEndDate === null) {
      newEndDate = new DateTime();
    }
    newEndDate.minutes = minutes;
    setEndDate(newEndDate);
    setEndDateOnParent(newEndDate);
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
    let items = [];
    for (let i = thisYear - 10; i <= thisYear + 1; i++) {
      items.push({ key: `${i}`, label: `${i}`, value: i });
    }

    return items;
  }

  const monthRange = () => {
    let items = [];
    for (let i = 1; i <= 12; i++) {
      items.push({ key: `${i}`, label: i18n.t(`MONTH_${i}`), value: i });
    }

    return items;
  }

  const dayRange = (month: number) => {
    let maxDay;
    if (month === 2) {
      maxDay = 29;
    } else {
      maxDay = [1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : 30;
    }
    
    let items = [];
    for (let i = 1; i <= maxDay; i++) {
      items.push({ key: `${i}`, label: `${i}`, value: i });
    }

    return items;
  }

  useEffect(() => {
    if (resetTrigger > 0) {
      const now = new DateTime();
      setStartDate(now)
      setStartDateOnParent(now);
      setStartHours(now.hours);
      setStartMinutes(now.minutes);
      setEndDate(null);
      setEndDateOnParent(null);
      setEndHours(null);
      setEndMinutes(null);
      saveLocation(null);
    }
  }, [resetTrigger]);

  return (
    <SafeAreaView>
      <InputGroup text={i18n.t('COORDINATES')} />
      <View className="flex flex-row items-center mt-2 mb-2">
        <InputLabel text={i18n.t('COORDINATES_DATE') + ': '} />
        <SelectField
          label={i18n.t('COORDINATES_DAY')}
          value={day}
          items={dayRange(month)}
          updateAction={(value: number) => saveDay(value)}
          style={{ flex: 1 }}
        />
        <SelectField
          label={i18n.t('COORDINATES_MONTH')}
          value={month}
          items={monthRange()}
          updateAction={(value: number) => saveMonth(value)}
          style={{ flex: 2 }}
        />
        <SelectField
          label={i18n.t('COORDINATES_YEAR')}
          value={year}
          items={yearRange()}
          updateAction={(value: number) => saveYear(value)}
          style={{ flex: 1 }}
        />
      </View>
      <View className="flex flex-row items-center mt-2 mb-2">
        <InputLabel text={i18n.t('COORDINATES_START_TIME') + ': '} />
        <SelectField
          label={i18n.t('COORDINATES_HOURS')}
          value={startHours}
          items={itemRange(0, 23)}
          updateAction={(value: number) => saveStartHours(value)}
          style={{ flex: 1 }}
        />
        <SelectField
          label={i18n.t('COORDINATES_MINUTES')}
          value={startMinutes}
          items={itemRange(0, 59)}
          updateAction={(value: number) => saveStartMinutes(value)}
          style={{ flex: 1 }}
        />
      </View>
      <View className="flex flex-row items-center mt-2 mb-2">
        <InputLabel text={i18n.t('COORDINATES_END_TIME') + ': '} />
        <SelectField
          label={i18n.t('COORDINATES_HOURS')}
          value={endHours}
          items={itemRange(0, 23)}
          updateAction={(value: number) => saveEndHours(value)}
          style={{ flex: 1 }}
        />
        <SelectField
          label={i18n.t('COORDINATES_MINUTES')}
          value={endMinutes}
          items={itemRange(0, 59)}
          updateAction={(value: number) => saveEndMinutes(value)}
          style={{ flex: 1 }}
        />
      </View>

      <View className="flex flex-row items-center mt-2 mb-2">
        <InputLabel text={i18n.t('COORDINATES_LOCATION') + ': '} />
        <SelectField
          label={i18n.t('COORDINATES_WHICH_BAY')}
          value={location}
          type={Location}
          updateAction={(value: Location) => saveLocation(value)}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

export default CoordinatesWithDuration;
