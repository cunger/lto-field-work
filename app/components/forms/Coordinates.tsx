import React, { useState } from 'react';
import { View } from 'react-native';
import { InputLabel, InputField, InputGroup } from './Input';
import DatePicker from 'react-native-neat-date-picker';
import SelectField from './SelectField';
import Location from '../../model/Location';
import { useTailwind } from 'tailwind-rn';

function Coordinates({ setDateOnParent, setLocationOnParent }) {
  const tailwind = useTailwind();
  
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState(date.getHours());
  const [minutes, setMinutes] = useState(date.getMinutes());
  const [location, setLocation] = useState(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveDate = (date: Date) => {
    setDate(date);
    setDateOnParent(date);
  };

  const saveHours = (hours: number) => {
    setHours(hours);
    date.setHours(hours);
    saveDate(date);
  };

  const saveMinutes = (minutes: number) => {
    setMinutes(minutes);
    date.setMinutes(minutes);
    saveDate(date);
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

  return (
    <View style={tailwind('mb-2')}>
      <InputGroup text='Coordinates' />
      <InputLabel text='Date' />
      <InputField
        text={date.toDateString()}
        action={() => setShowDatePicker(true)}
      />
      <DatePicker
        isVisible={showDatePicker}
        mode={'single'}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        onConfirm={value => {
          saveDate(value);
          setShowDatePicker(false);
        }}
        colorOptions={{
          headerColor: '#6ec1e4',
          weekDaysColor: '#6ec1e4',
          selectedDateBackgroundColor: '#6ec1e4',
          confirmButtonColor: '#6ec1e4'
        }}
      />
      <View style={tailwind('flex flex-row items-stretch my-2')}>
        <InputLabel text='Time: ' />
        <SelectField
          label='Hours'
          value={hours}
          items={itemRange(0,23)}
          updateAction={(value) => saveHours(value)}
        />
        <SelectField
          label='Minutes'
          value={minutes}
          items={itemRange(0,59)}
          updateAction={(value) => saveMinutes(value)}
        />
      </View>

      <InputLabel text='Location' />
      <SelectField
        label='Which bay?'
        value={location}
        type={Location}
        updateAction={(value) => saveLocation(value)}
      />
    </View>
  );
}

export default Coordinates;
