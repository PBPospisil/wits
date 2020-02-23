import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { Context } from '../context/TripContext';
import { DARK_SKY_API_KEY } from 'react-native-dotenv';
import WeatherDatabase from './WeatherDatabase';


const GetWeather = () => {

  const { state } = useContext(Context);
  const baseUrl = 'https://api.darksky.net/forecast/';

  //console.log(state)

  function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

  useEffect(() => {
    const makeCallToWeatherApi = async () => {
      let weatherDataPromises = await Promise.all(state.map(async place => {
        //console.log(place, DARK_SKY_API_KEY, place.coordinates.lat, place.coordinates.lng)
        try {
          let res = await axios({
             url: `${DARK_SKY_API_KEY}/${place.coordinates.lat},${place.coordinates.lng}`,
             baseURL: baseUrl });
          //console.log(res)
          // if (res) {
          //   console.log(res.data.daily)
          // }
          console.log(memorySizeOf(res))
          return {
            city_id: place.id,
            city: place.name,
            weather: res
          }


        } catch (err) {
          console.log(err);
          return null;
        }
      }));
      console.log(state.length, weatherDataPromises.length)
      if (weatherDataPromises.length == state.length) {
        console.log('here', weatherDataPromises.length)
        let weatherDb = new WeatherDatabase('test.db')
        weatherDb.createWeatherTable(weatherDataPromises);

        //weatherDb.printTable();
        weatherDb.dbExists()
      }
    }

    makeCallToWeatherApi();
  }, [])

  return (
    <View></View>
  );
};

export default GetWeather;
