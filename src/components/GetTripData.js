import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_GEOCODING_API_KEY } from 'react-native-dotenv';
import GetRoute from './GetRoute';
import axios from 'axios';
import { Context } from '../context/TripContext';
import * as SQLite from 'expo-sqlite';
import WeatherDatabase from '../components/WeatherDatabase';


export const GetTripData = () => {

  const { state, editLocationData, deleteState } = useContext(Context);
  const [hasUpdated, setHasUpdated] = useState(false);

  console.log('in get trip data')
  //deleteState()

  //   const getCoordinates = async () => {
  //     let coordPromises = await Promise.all(state.map(async (place, index) => {
  //       try {
  //         let res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place.address}&key=${GOOGLE_GEOCODING_API_KEY}`)
  //         if (res.data) {
  //           if (res.data.results[0]) {
  //             if (res.data.results[0].geometry) {
  //               if(res.data.results[0].geometry.location) {
  //                 return {
  //                   id: place.id,
  //                   name: place.name,
  //                   address: place.address,
  //                   coordinates: res.data.results[0].geometry.location
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       } catch (err) {
  //         console.log(err);
  //         return null;
  //       }
  //     }));
  //     coordPromises = coordPromises.filter(x => x != null);
  //     if (coordPromises) {
  //       if (coordPromises[0]) {
  //         if (coordPromises[0].coordinates != {} && !hasUpdated) {
  //           editLocationData(
  //             'location',
  //             state.find(location => location.name == coordPromises[0].name).id,
  //             coordPromises[0].name,
  //             coordPromises[0].address,
  //             coordPromises[0].coordinates)
  //           editLocationData(
  //             'location',
  //             state.find(location => location.name == coordPromises[1].name).id,
  //             coordPromises[1].name,
  //             coordPromises[1].address,
  //             coordPromises[1].coordinates)
  //           setHasUpdated(true);
  //         }
  //       }
  //     }
  //   };
  //
  //   getCoordinates()

  //
  // if(hasUpdated) {
  //   GetRoute()
  // }

  return
};
