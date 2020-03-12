import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WeatherDatabase from '../components/WeatherDatabase';


const LoadingScreen = () => {

  return(
    <View style={styles.main}></View>
  );
};

LoadingScreen.navigationOptions = ({ navigation }) => {

  async function getExists () {
    if (await new WeatherDatabase('test.db').dbExists()) {
      navigation.replace('RootResults')
    } else {
      navigation.replace('Search')
    }
  }
  getExists()

}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    backgroundColor: '#1079C5'
  }
});

export default LoadingScreen;
