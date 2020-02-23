import React from 'react';
import {View} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_GEOCODING_API_KEY } from 'react-native-dotenv';


const GoogleMapsPlacesSearch = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Departure Location'
      minLength={2}
      autoFocus={false}
      returnKeyType={'search'}
      keyboardAppearance={'light'}
      listViewDisplayed={true}
      fetchDetails={true}
      renderDescription={row => row.description}
      onPress={(data, details = null) => {
        console.log(data, details, 'poopoo');
      }}

      getDefaultValue={() => ''}

      query={{
        key: GOOGLE_GEOCODING_API_KEY,
        language: 'en',
        types: '(cities)'
      }}

      nearbyPlacesAPI='GooglePlacesSearch'
      GooglePlacesSearchQuery={{
        rankby: 'distance',
        type: 'cafe'
      }}

    />
  );
};

export default GoogleMapsPlacesSearch;
