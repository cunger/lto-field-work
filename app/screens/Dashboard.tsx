import * as React from 'react';
import { Text } from 'react-native';
import SafeContainer from '../components/SafeContainer';
import { useTailwind } from 'tailwind-rn';

function Dashboard() {
  const tailwind = useTailwind();

  return (
    <SafeContainer>
      <Text style={tailwind('my-2')}>
        👋 Hello, ocean hero!
      </Text>
      <Text style={tailwind('my-2')}>
        Welcome aboard the Love The Oceans team.
      </Text>
    </SafeContainer>
  );
}

export default Dashboard;
