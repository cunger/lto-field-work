import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { InputLabel, InputField, InputGroup } from './Input';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // https://www.npmjs.com/package/react-native-modal-datetime-picker
import SelectField from './SelectField';
import Location from '../../model/Location';
import GlobalContext from '../../context/GlobalContext';
import { useTailwind } from 'tailwind-rn';

function Coordinates({ inputDate, inputLocation, setDateOnParent, setLocationOnParent }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;
  
  const [date, setDate] = useState(inputDate);
  const [hours, setHours] = useState(date.getHours());
  const [minutes, setMinutes] = useState(date.getMinutes());
  const [location, setLocation] = useState(inputLocation);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const saveDate = (value: object) => {
    let newDate = value;
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
    setDateOnParent(newDate);
    setDatePickerVisible(false);
  };

  const saveHours = (hours: number) => {
    setHours(hours);
    date.setHours(hours);
    date.setMinutes(minutes);
    setDate(date);
    setDateOnParent(date);
  };

  const saveMinutes = (minutes: number) => {
    setMinutes(minutes);
    date.setHours(hours);
    date.setMinutes(minutes);
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

  return (
    <SafeAreaView>
      <View style={tailwind('mb-2')}>
        <InputGroup text={i18n.t('COORDINATES')} />
        <InputLabel text={i18n.t('COORDINATES_DATE')} />
        <InputField 
          text={date.toDateString()}
          action={() => setDatePickerVisible(true)} 
        />
        <DateTimePickerModal
          date={date}
          isVisible={datePickerVisible}
          mode='date'
          display='inline'
          onConfirm={saveDate}
          onCancel={() => setDatePickerVisible(false)}
          maximumDate={new Date()}
        />
        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <InputLabel text={i18n.t('COORDINATES_TIME') + ': '} />
          <SelectField
            label={i18n.t('COORDINATES_HOURS')}
            value={hours}
            items={itemRange(0,23)}
            updateAction={(value) => saveHours(value)}
          />
          <SelectField
            label={i18n.t('COORDINATES_MINUTES')}
            value={minutes}
            items={itemRange(0,59)}
            updateAction={(value) => saveMinutes(value)}
          />
        </View>

        <InputLabel text={i18n.t('COORDINATES_LOCATION')} />
        <SelectField
          label={i18n.t('COORDINATES_WHICH_BAY')}
          value={location}
          type={Location}
          updateAction={(value) => saveLocation(value)}
        />
      </View>
    </SafeAreaView>
  );
}

export default Coordinates;
