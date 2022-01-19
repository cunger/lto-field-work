import * as React from 'react';
import { Text } from 'react-native';
import SafeContainer from 'components/SafeContainer';

function Home() {
  return (
    <SafeContainer>
      <Text>Who is LTO?</Text>
      <Text>
        Love The Oceans (LTO) is a non-profit marine conservation organisation working in Guinjata Bay, Mozambique. Guinjata Bay, whilst home to a huge host of marine life, has never been studied in depth for any prolonged amount of time. Love The Oceans hopes to protect and study the diverse marine life found here, including many species of sharks, rays and the famous humpback whales. We use research, education and diving to drive action towards a more sustainable future. Our ultimate goal is to establish a Marine Protected Area for the Inhambane Province in Mozambique, achieving higher biodiversity whilst protecting endangered species. 
     </Text>
    </SafeContainer>
  );
}

export default Home;
