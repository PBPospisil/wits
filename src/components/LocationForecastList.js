import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import DailyForecastBox from './DailyForecastBox';

const ITEM_HEIGHT = 145

const LocationForecastList = ({ dailyWeather, initialDate }) => {

  console.log('MOUNTING LOCATION LIST')


  return(
    <View style={styles.locationListStyle}>
      <FlatList
        horizontal={true}
        getItemLayout={(data, index) => (
          {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
        )}
        initialScrollIndex={initialDate}
        key={initialDate}
        data={dailyWeather.data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={day => day.time.toString()}
        renderItem={ ({ item, index }) => {
          return(
            <View style={index == initialDate
                          ? styles.innerListInitalDate
                          : styles.innerListStyle}>
              <DailyForecastBox dailyWeather={item} days={index} initialDate={initialDate} />
            </View>
          );
        }}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  locationListStyle: {
    height: 150,
    width: '100%'
  },
  innerListStyle: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  },
  innerListInitalDate: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  }
});

export default LocationForecastList;
