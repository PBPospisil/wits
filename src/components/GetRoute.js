import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { GOOGLE_GEOCODING_API_KEY } from 'react-native-dotenv';
import Expo from 'expo';
import axios from 'axios';
import { Context } from '../context/TripContext';
var polyUtil = require('polyline-encoded');
import GetWeather from './GetWeather';



const GetRoute = () => {

  const { state, setLocationData } = useContext(Context);

  const [readyForUpdate, setReadyForUpdate] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);

  // //console.log(state);
  //
  // const origin = state.find(place => {
  //   place.id === '@';
  // });
  // const destination = state.find(place => {
  //   place.id === '$';
  // });

  //console.log(origin, destination);

  const origin = {lat: 53.631611, lng: -113.323975};
  const destination = {lat: 51.05011, lng: -114.08529};

  const [citiesOnRoute, setCitiesOnRoute] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  function onlyUnique(arr) {
    var flags = [];
    var output = [];
    var l = arr.length;
    var i;
    for (i=0; i<l; i++) {
      if (flags.includes(arr[i].name)) continue;
      flags.push(arr[i].name);
      output.push({ 'name': arr[i].name, 'coordinates': arr[i].coordinates });
    }
    return output;
  }

  function toRad(val) {
    return val * Math.PI / 180;
  }

  function distanceFrom(pointA, pointB, Threshold) {
    const R = 6371;
    const latARads = toRad(pointA.lat);
    const latBRads = toRad(pointB.lat);
    const latDeltaRads = latBRads - latARads;
    const lngDeltaRads = toRad(pointB.lng - pointA.lng);

    var a = (Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) +
             (Math.cos(latARads) * Math.cos(latBRads) *
             Math.sin(lngDeltaRads/2) * Math.sin(lngDeltaRads/2)));

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    if (d > Threshold) {
      return true;
    } else {
      return false;
    }
  }

  function cityDistanceThreshold(cities, origin_, isFarEnough) {
    if (distanceFrom(cities[0].coordinates, origin_, 50)) {
      if (cities.length == 1) {
        isFarEnough.push(cities[0]);
        return isFarEnough;
      }
      isFarEnough.push(cities[0]);
      cityDistanceThreshold(cities.slice(1), cities[0].coordinates, isFarEnough);
      return isFarEnough;

    } else {
      if (cities.length == 1) {
        isFarEnough.pop()
        isFarEnough.push(cities[0])
        return isFarEnough
      }
      cityDistanceThreshold(cities.slice(1), origin_, isFarEnough)
      return isFarEnough;
    }
  }

   function setStateAsync(state) {
     return new Promise((resolve) => {
       setCitiesOnRoute([...citiesOnRoute, state])
     });
   }

  var time = new Date();

  useEffect(() => {
    const getRoute = async () => {
      try {
        let res = await axios.get('http://192.168.6.110:5000/route/v1/driving/-113.323975,53.631611;-114.0719,51.0447');
        var latlngs = polyUtil.decode(res.data.routes[0].geometry);
        let coordPromises = await Promise.all(latlngs.map(async (place) => {
          try {
            let res = await axios.get(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${place[0]}&lng=${place[1]}&cities=cities10000&radius=20&username=wits`);

            if (res.data) {
              if (res.data.geonames) {
                if (res.data.geonames[0]) {
                  if (res.data.geonames[0].name) {
                    return {
                      id: '',
                      name: res.data.geonames[0].name,
                      address: '',
                      coordinates: {
                        lat: res.data.geonames[0].lat,
                        lng: res.data.geonames[0].lng
                       },
                      };
                  }
                }
              }
            }
          } catch (err) {
            console.log(err);
            return null;
          };
        }));
        coordPromises = coordPromises.filter(x => x != null);
        coordPromises.push({ id: '', name: 'Calgary', address: '', coordinates: destination })

        var citiesSpacedByThreshold = cityDistanceThreshold(onlyUnique(coordPromises), {lat: 53.631611, lng: -113.323975}, [])
        setCitiesOnRoute([{ id: '', name: 'Edmonton', address: '', coordinates: origin }, ...citiesSpacedByThreshold]);
        setRouteCoordinates(latlngs);

      } catch (err) {
        console.log(err);
      }
    };

    getRoute();
  }, []);

  if (routeCoordinates.length != 0 && !hasUpdated){
    setReadyForUpdate(true);
  };
  if (readyForUpdate) {
    citiesOnRoute.map((place, index) => {
      if (place.name != state.find(leafNode => leafNode.id == '@').name &&
          place.name != state.find(leafNode =>leafNode.id == '$').name) {
        setLocationData(Math.floor(Math.random() * 99999), place.name, '', place.coordinates)
        setReadyForUpdate(false);
        setHasUpdated(true);

        //console.log(place)
      }
    });
  };


  return (
    <View>
      { hasUpdated && citiesOnRoute.length == state.length ? <GetWeather /> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%'
  }
});

export default GetRoute;
