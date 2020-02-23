import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_GEOCODING_API_KEY } from 'react-native-dotenv';
import GetRoute from './GetRoute';
import axios from 'axios';
import { Context } from '../context/TripContext';
import * as SQLite from 'expo-sqlite';



const GetTripData = () => {

  const { state, editLocationData } = useContext(Context);
  const [hasUpdated, setHasUpdated] = useState(false);

  //console.log(state);

  const origin = {lat: 53.631611, lng: -113.323975};
  const destination = {lat: 51.05011, lng: -114.08529};

  // useEffect(() => {
  //   editLocationData('@', 'Edmonton', 'Edmonton, AB, CA', origin);
  //   editLocationData('$', 'Calgary', 'Calgary, AB, CA', destination);
  // }, [])

  var searchedLocations = [{ 'name': 'Edmonton', 'address': 'Edmonton, AB, CA', 'coordinates': {} },
                           { 'name': 'Calgary', 'address': 'Calgary, AB, CA', 'coordinates': {} }]

  //const darksky = new DarkSky(process.env.DARK_SKY_API_KEY);

  useEffect(() => {
    const getCoordinates = async () => {
      let coordPromises = await Promise.all(searchedLocations.map(async (place, index) => {
        try {
          let res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place.address}&key=${GOOGLE_GEOCODING_API_KEY}`)
          if (res.data) {
            if (res.data.results[0]) {
              if (res.data.results[0].geometry) {
                if(res.data.results[0].geometry.location) {
                  return {
                    id: place.id,
                    name: place.name,
                    address: place.address,
                    coordinates: res.data.results[0].geometry.location
                  }
                }
              }
            }
          }
        } catch (err) {
          console.log(err);
          return null;
        }
      }));
      coordPromises = coordPromises.filter(x => x != null);
      if (coordPromises) {
        if (coordPromises[0]) {
          if (coordPromises[0].coordinates != {} && !hasUpdated) {
            console.log(coordPromises)
            editLocationData(
              state.find(location => location.name == coordPromises[0].name).id,
              coordPromises[0].name,
              coordPromises[0].address,
              coordPromises[0].coordinates)
            editLocationData(
              state.find(location => location.name == coordPromises[1].name).id,
              coordPromises[1].name,
              coordPromises[1].address,
              coordPromises[1].coordinates)
            setHasUpdated(true);
          }
        }
      }
    };


    getCoordinates()
  }, []);

  return (
    <View>
      { hasUpdated ? <GetRoute /> : null }
    </View>
  );
};

export default GetTripData;
