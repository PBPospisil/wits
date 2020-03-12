import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
var moment = require('moment');



const DailyForecastBox = ({ dailyWeather, days, initialDate }) => {

  console.log('MOUNTING BOX LIST')


  const determineWeatherIcon = (icon) => {
    switch (icon) {
      case 'partly-cloudy-day':
        return 'weather-partlycloudy'
      case 'clear-day':
        return 'weather-sunny'
      case 'snow':
        return 'weather-snowy'
      case 'fog':
        return 'weather-fog'
      case 'cloudy':
        return 'weather-cloudy'
      case 'wind':
        return 'weather-windy'
      case 'rain':
        return 'weather-rainy'
      default:
        console.log('ERROR: Icon is not recognized!', icon)
    }
  };

  const fahrenheitToCelsius = (fahrenheit) => {
    return Math.round((fahrenheit - 32) * 5/9)
  };
  const milesToKilometers = (miles) => {
    return Math.round(1.609 * miles)
  }

  const icon = determineWeatherIcon(dailyWeather.icon)

  return(
    <View style={days == initialDate
                  ? styles.mainBoxInitialDate
                  : styles.mainBox}>
      <Text style={styles.dateStyle}>{moment(new Date()).add(days, 'days').format('ddd, MMM Do YYYY')}</Text>
      <MaterialCommunityIcons style={styles.iconStyle} name={icon} size={40} />
      <View>
        <View style={styles.tempBoxStyle}>
          <Text style={styles.tempTextStyle}>{fahrenheitToCelsius(dailyWeather.temperatureHigh)}</Text>
          <Text style={styles.celciusTextStyle}>ºC </Text>
          <Text style={styles.tempHighStyle}>H</Text>
          <Text style={styles.tempTextStyle}> / {fahrenheitToCelsius(dailyWeather.temperatureLow)}</Text>
          <Text style={styles.celciusTextStyle}>ºC </Text>
          <Text style={styles.tempLowStyle}>L</Text>
        </View>
        <View style={styles.windMainStyle}>
          <Text style={styles.windTextStyle}>{milesToKilometers(dailyWeather.windSpeed)}</Text>
          <Text style={styles.windSpeedUnits}>km/h</Text>
          <MaterialCommunityIcons style={styles.windIconStyle} name='weather-windy' size={12} />
        </View>
        <Text style={styles.summaryStyle}>{dailyWeather.summary}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBox: {
    height: 142,
    width: 142,
    paddingTop: 10,
    justifyContent: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#1079C5',
    margin: 0,
    alignItems: 'center',
    borderRadius: 18,
    elevation: 2,
    backgroundColor: 'white'
  },
  mainBoxInitialDate: {
    height: 142,
    width: 300,
    paddingTop: 10,
    justifyContent: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#1079C5',
    margin: 0,
    alignItems: 'center',
    borderRadius: 18,
    elevation: 2,
    backgroundColor: 'white'
  },
  tempHighStyle: {
    color: 'red',
    fontSize: 12
  },
  tempTextStyle: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  tempLowStyle: {
    color: 'blue',
    fontSize: 12
  },
  celciusTextStyle: {
    fontSize: 8,
    paddingTop: 1
  },
  tempBoxStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 1
  },
  iconStyle: {
    paddingBottom: 1
  },
  dateStyle: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  summaryStyle: {
    fontSize: 10,
    paddingTop: 6,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  windIconStyle: {
    padding: 1,
    paddingTop: 2
  },
  windTextStyle: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  windMainStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  windSpeedUnits: {
    fontSize: 8,
    alignSelf: 'flex-end',
    paddingBottom: 1.76,
    paddingLeft: 1
  }
});

export default DailyForecastBox;
