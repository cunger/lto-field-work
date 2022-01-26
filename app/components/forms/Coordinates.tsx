import React, { useState } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity, Platform } from 'react-native';
import { InputLabel, InputField } from 'components/forms/Input';
import RNPickerSelect from 'react-native-picker-select'; // https://github.com/lawnstarter/react-native-picker-select
import DatePicker from 'react-native-neat-date-picker';
import SafeContainer from 'components/SafeContainer';
import Location from 'model/Location';
import { tailwind } from 'tailwind';
import styles from '../../styles/select';

function Coordinates({ setDateOnParent, setLocationOnParent }) {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(Location.Guinjata);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const saveDate = (date) => {
    setDate(date);
    setDateOnParent(date);
  };

  const saveLocation = (location) => {
    setLocation(location);
    setLocationOnParent(location);
  };

  return (
    <View style={tailwind('mb-2')}>
      <InputLabel text='Date' />
      <InputField
        text={date.toDateString()}
        action={() => setShowDatePicker(true)} />
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

      <InputLabel text='Location' />
      <RNPickerSelect
        value={location}
        placeholder={{ label: 'Where?', value: undefined }}
        onValueChange={(value, _) => saveLocation(value)}
        items={Object.keys(Location).map(key => {
          return { label: Location[key], value: key };
        })}
        style={{
          inputAndroid: styles.input,
          inputAndroidContainer: styles.inputContainer,
          inputIOS: styles.input,
          inputIOSContainer: styles.inputContainer
        }}
      />
    </View>
  );
}

// <TouchableOpacity
//   onPress={() => setShowLocationPicker(true)}
//   style={tailwind('px-4 py-2 mb-2 rounded-md bg-white')}>
//   <Text>{location}</Text>
// </TouchableOpacity>
// {showLocationPicker && (
//   <View style={tailwind('rounded-md bg-white')}>
//     <TouchableOpacity
//       onPress={() => setShowLocationPicker(false)}
//       style={tailwind('px-2 py-2')}>
//       <Text>✖️ Close</Text>
//     </TouchableOpacity>
//     <Picker
//       selectedValue={location}
//       onValueChange={(value, _) => {
//         saveLocation(value);
//         setShowLocationPicker(false);
//       }}>
//       {Object.keys(Location).map(key => (
//         <Picker.Item key={key} label={Location[key]} value={key} />
//       ))}
//     </Picker>
//   </View>
// )}

export default Coordinates;