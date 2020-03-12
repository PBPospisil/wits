import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { Context } from '../context/TripContext';
import { DARK_SKY_API_KEY } from 'react-native-dotenv';
import WeatherDatabase from './WeatherDatabase';
import { NavigationActions } from 'react-navigation';
import {DrawerActions} from 'react-navigation-drawer'


export default () => {
  console.log('in get weather')

  const { state, deleteState } = useContext(Context);

  const getDepartureLocation = () => {
    return locationState.find(location => location.id == '1').name
  };
  const getDestinationLocation = () => {
    return locationState.find(location => location.id == '-1').name
  };

  const baseUrl = 'https://api.darksky.net/forecast/';

  const getRouteTableSize = async (weatherDataPromises) => {
    let weatherDb = new WeatherDatabase('test.db')
    let res = await weatherDb.createWeatherTable(weatherDataPromises);
    let res1 = await new WeatherDatabase('test.db').printTable()
    console.log(res1)
    if(res1) {
      console.log(res1, weatherDataPromises.length)
      if (res1 == weatherDataPromises.length) {
        //deleteState()
        let param = getDepartureLocation().concat('-', getDestinationLocation())
        navigation.navigate('RootResults', { yoyo: param })
      }
    }
  }

  useEffect(() => {
    const makeCallToWeatherApi = async () => {
      let weatherDataPromises = await Promise.all(state.map(async place => {
        try {
          let res = await axios({
             url: `${DARK_SKY_API_KEY}/${place.coordinates.lat},${place.coordinates.lng}`,
             baseURL: baseUrl });
          return {
            id: place.id,
            city: place.name,
            weather: res,
            coordinates: place.coordinates
          }
        } catch (err) {
          console.log(err);
          return null;
        }
      }));

      if (weatherDataPromises.length == state.length) {
        getRouteTableSize(weatherDataPromises)
      }
    }

    makeCallToWeatherApi();
  }, [])

  return
};
