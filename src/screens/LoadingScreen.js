import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WeatherDatabase from '../components/WeatherDatabase';


const LoadingScreen = () => {

  return(
    <View style={styles.main}></View>
  );
};

LoadingScreen.navigationOptions = ({ navigation }) => {
  let weatherDb = new WeatherDatabase('test.db')
  let db = weatherDb.getDb();

  let res;
  async function getExists () {
    res = await weatherDb.dbExists()
    console.log(res)
    if (1) {
      console.log('db exists');
      navigation.replace('RootResults')
    } else {
      console.log('db does not exist');
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
