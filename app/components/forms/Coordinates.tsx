import React, { useState } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SafeContainer from 'components/SafeContainer';
import InputLabel from 'components/forms/InputLabel';
import Location from 'model/Location';
import { tailwind } from 'tailwind';

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
    <View>
      <InputLabel text='Date' />
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={tailwind('px-4 py-2 mb-2 rounded-md bg-blue')}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <View style={{ backgroundColor: 'white' }}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(false)}
            style={tailwind('px-4 py-2 mr-4 justify-end rounded-md')}>
            <Text>Done</Text>
          </TouchableOpacity>
          <DateTimePicker
            value={date}
            onChange={(_, value) => { saveDate(value); }}
            mode='date'
            is24Hour={true}
            display={Platform.iOS ? 'default' : 'calendar'}
          />
        </View>
      )}

      <InputLabel text='Location' />
      <TouchableOpacity
        onPress={() => setShowLocationPicker(true)}
        style={tailwind('px-4 py-2 mb-2 rounded-md bg-blue')}>
        <Text>{location}</Text>
      </TouchableOpacity>
      {showLocationPicker && (
        <View style={{ backgroundColor: 'white' }}>
          <TouchableOpacity
            onPress={() => setShowLocationPicker(false)}
            style={tailwind('px-4 py-2 mr-4 justify-end rounded-md')}>
            <Text>Done</Text>
          </TouchableOpacity>
          <Text>Option: use my current GPS coordinates</Text>
          <Picker
            selectedValue={location}
            onValueChange={(value, _) => { saveLocation(value); }}>
            {Object.keys(Location).map(key => (
              <Picker.Item key={key} label={Location[key]} value={key} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
}

export default Coordinates;
