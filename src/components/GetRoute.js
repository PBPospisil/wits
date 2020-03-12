import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { GOOGLE_GEOCODING_API_KEY } from 'react-native-dotenv';
import Expo from 'expo';
import axios from 'axios';
import { Context } from '../context/TripContext';
var polyUtil = require('polyline-encoded');
import GetWeather from './GetWeather';


export default () => {
  console.log('in get route')
  const { state, setLocationData } = useContext(Context);

  const [hasUpdated, setHasUpdated] = useState(false);
  const [readyForUpdate, setReadyForUpdate] = useState(false);
  const [citiesOnRoute, setCitiesOnRoute] = useState([]);

  const getDepartureLocation = () => {
    return locationState.find(location => location.id == '1').name
  };
  const getDestinationLocation = () => {
    return locationState.find(location => location.id == '-1').name
  };
  const getDepartureCoordinates = () => {
    return locationState.find(location => location.id == '1').coordinates
  };
  const getDestinationCoordinates = () => {
    return locationState.find(location => location.id == '-1').coordinates
  };

  const origin = {lat: 53.631611, lng: -113.323975};
  const destination = {lat: 51.05011, lng: -114.08529};


  function toRad(val) {
    return val * Math.PI / 180;
  }

  function distanceFrom(pointA, pointB, Threshold) {
    const R = 6371;
    const latARads = toRad(pointA.lat);
    const latBRads = toRad(pointB.lat);
    const latDeltaRads = latBRads - latARads;
    const lngDeltaRads = toRad(pointB.lng - pointA.lng);

    console.log('in math')

    var a = (Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) +
             (Math.cos(latARads) * Math.cos(latBRads) *
             Math.sin(lngDeltaRads/2) * Math.sin(lngDeltaRads/2)));

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    if (d > Threshold) {
      console.log(pointA, pointB, d)
      return true;
    } else {
      return false;
    }
  }

  function cityDistanceThreshold(cities, origin_, isFarEnough) {
    console.log('in city distance Threshold')
    if (distanceFrom(cities[0].coordinates, origin_, 100)) {
      console.log(cities.length, '1')

      if (cities.length == 1) {
        console.log(cities[0])

        isFarEnough.push(cities[0]);
        console.log(cities[0])

        return isFarEnough;
      }
      console.log(cities[0])

      isFarEnough.push(cities[0]);
      console.log(cities[0])
      cityDistanceThreshold(cities.slice(1), cities[0].coordinates, isFarEnough);
      return isFarEnough;

    } else {
      console.log(cities.length, '2')

      if (cities.length == 1) {
        isFarEnough.pop()
        isFarEnough.push(cities[0])
        console.log(cities[0], isFarEnough)

        return isFarEnough
      }
      cityDistanceThreshold(cities.slice(1), origin_, isFarEnough)
      return isFarEnough;
    }
  }

  function polylineToCoordinateObject(polyline) {
    return polyline.map(coordinate => {
      return {
        coordinates: {
          lat: coordinate[0],
          lng: coordinate[1]
        }
      }
    });
  };

  function coordinateObjectToPolyline(coordinates) {
    return coordinates.map(coordinate => {
      return [coordinate.coordinates.lat, coordinate.coordinates.lng]
    });
  };

  useEffect(() => {
    const getRoute = async () => {
      try {
        const departureCoordinates = getDepartureCoordinates();
        const destinationCoordinates = getDestinationCoordinates();
        let res = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${departureCoordinates.lat},${departureCoordinates.lng}&destination=${destinationCoordinates.lat},${destinationCoordinates.lng}&key=${GOOGLE_GEOCODING_API_KEY}`);
        var latlngs = polyUtil.decode(res.data.routes[0].overview_polyline.points);
        ob_ = polylineToCoordinateObject(latlngs)
        console.log(latlngs, ob_)
        newlat = coordinateObjectToPolyline(cityDistanceThreshold(ob_, getDepartureCoordinates(), []))
        console.log(newlat)
        new WeatherDatabase('test.db').createRoutesTable(
          {
            latlngs: latlngs,
            departure_location: getDepartureLocation(),
            destination_location: getDestinationLocation()
          }
        );
        let coordPromises = await Promise.all(newlat.map(async (place) => {
          try {
            let res = await axios.get(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${place[0]}&lng=${place[1]}&cities=cities10000&radius=20&username=wits`);
            if (res.data) {
              if (res.data.geonames) {
                if (res.data.geonames[0]) {
                  if (res.data.geonames[0].name) {
                    console.log(res.data.geonames[0].lat, res.data.geonames[0].name, place)
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
        console.log('here')
        console.log(coordPromises)
        coordPromises.push({ id: '', name: getDestinationLocation(), address: '', coordinates: getDestinationCoordinates() })

        var citiesSpacedByThreshold = cityDistanceThreshold(coordPromises, getDepartureCoordinates(), [])
        setCitiesOnRoute(citiesSpacedByThreshold);

      } catch (err) {
        console.log(err);
      }
    };

    getRoute();
  }, []);

  console.log(citiesOnRoute)
  if (citiesOnRoute.length != 0 && !hasUpdated && !readyForUpdate){
    console.log('here')
    setReadyForUpdate(true)
  };
  if (readyForUpdate) {
    citiesOnRoute.map((place, index) => {
      console.log(place.name)
      if (place.name != state.find(leafNode => leafNode.id == '1').name &&
          place.name != state.find(leafNode =>leafNode.id == '-1').name) {
        //console.log(place.name)
        setLocationData('location', Math.floor(Math.random() * 99999), place.name, '', place.coordinates)
      } else {
        setHasUpdated(true)
      }
    });
  };

  console.log(locationState.length, citiesOnRoute.length)

  if(hasUpdated && state.length - citiesOnRoute.length == 1) {
    GetWeather()
  }

  return
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%'
  }
});
