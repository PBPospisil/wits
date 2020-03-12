import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { GetTripData } from '../components/GetTripData';
import GoogleMapsPlacesSearch  from '../components/GoogleMapsPlacesSearch';
import { Context } from '../context/TripContext';
import axios from 'axios';
import { GOOGLE_GEOCODING_API_KEY } from 'react-native-dotenv';
var polyUtil = require('polyline-encoded');
import WeatherDatabase from '../components/WeatherDatabase';
import { DARK_SKY_API_KEY } from 'react-native-dotenv';



const BLUE = '#1079C5';
const LIGHT_GRAY = '#D3D3D3';

const SearchScreen = ({ navigation }) => {

  const { state, setLocationData, editLocationData } = useContext(Context)

  const [loading, setLoading] = useState(false)

  const [focusDeparture, setFocusDeparture] = useState(false)
  const [focusDestination, setFocusDestination] = useState(false)

  const [departureLocation, setDepartureLocation] = useState('')
  const [destinationLocation, setDestinationLocation] = useState('')

  const [departureDateTime, setDepartureDateTime] = useState(
    { date: new Date(),
      time: new Date(),
      mode: 'date',
      showDate: false,
      showTime: false
    })
  const [destinationDateTime, setDestinationDateTime] = useState(
    { date: new Date(),
      time: new Date(),
      mode: 'date',
      showDate: false,
      showTime: false
    })

  const showDate = (mode, field) => {
    field === 'departure'
      ? setDepartureDateTime(
        { date: departureDateTime.date,
          time: departureDateTime.time,
          mode,
          showDate: true,
          showTime: false
        })
        : setDestinationDateTime(
          { date: destinationDateTime.date,
            time: destinationDateTime.time,
            mode,
            showDate: true,
            showTime: false
          })
  };

  const showTime = (mode, field) => {
    field === 'departure'
      ? setDepartureDateTime(
        { date: departureDateTime.date,
          time: departureDateTime.time,
          mode,
          showDate: false,
          showTime: true
        })
        : setDestinationDateTime(
          { date: destinationDateTime.date,
            time: destinationDateTime.time,
            mode,
            showDate: false,
            showTime: true
          })
  };

  const datepicker = (field) => {
    showDate('date', field)
  };

  const timepicker = (field) => {
    showTime('time', field)
  };

  const departureDateTimeEntered = (event, dateTime) => {
    departureDateTime.mode === 'date'
      ? ((dateTime = dateTime || departureDateTime.date),
        setDepartureDateTime({ date: dateTime,
          time: departureDateTime.time,
          mode: 'date',
          showDate: Platform.OS === 'ios' ? true : false,
          showTime: departureDateTime.showTime
        }))
        : ((dateTime = dateTime || departureDateTime.time),
          setDepartureDateTime({ date: departureDateTime.date,
            time: dateTime,
            mode: 'time',
            showDate: departureDateTime.showDate,
            showTime: Platform.OS === 'ios' ? true : false
          }))
  };

  const destinationDateTimeEntered = (event, dateTime) => {
    destinationDateTime.mode === 'date'
      ? ((dateTime = dateTime || destinationDateTime.date),
        setDestinationDateTime({ date: dateTime,
          time: destinationDateTime.time,
          mode: 'date',
          showDate: Platform.OS === 'ios' ? true : false,
          showTime: destinationDateTime.showTime
        }))
        : ((dateTime = dateTime || destinationDateTime.time),
          setDestinationDateTime({ date: destinationDateTime.date,
            time: dateTime,
            mode: 'time',
            showDate: destinationDateTime.showDate,
            showTime: Platform.OS === 'ios' ? true : false
          }))
  };

  const getDepartureLocation = (locationState) => {
    return locationState.find(location => location.id == '1').name
  };
  const getDestinationLocation = (locationState) => {
    return locationState.find(location => location.id == '-1').name
  };
  const getDepartureCoordinates = (locationState) => {
    return locationState.find(location => location.id == '1').coordinates
  };
  const getDestinationCoordinates = (locationState) => {
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

    //console.log('in math')

    var a = (Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) +
             (Math.cos(latARads) * Math.cos(latBRads) *
             Math.sin(lngDeltaRads/2) * Math.sin(lngDeltaRads/2)));

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    if (d > Threshold) {
      //console.log(pointA, pointB, d)
      return true;
    } else {
      return false;
    }
  }

  function cityDistanceThreshold(cities, origin_, isFarEnough) {
    //console.log('in city distance Threshold')
    if (distanceFrom(cities[0].coordinates, origin_, 100)) {
      //console.log(cities.length, '1')

      if (cities.length == 1) {
        //console.log(cities[0])

        isFarEnough.push(cities[0]);
        //console.log(cities[0])

        return isFarEnough;
      }
      //console.log(cities[0])

      isFarEnough.push(cities[0]);
      //console.log(cities[0])
      cityDistanceThreshold(cities.slice(1), cities[0].coordinates, isFarEnough);
      return isFarEnough;

    } else {
      //console.log(cities.length, '2')

      if (cities.length == 1) {
        isFarEnough.pop()
        isFarEnough.push(cities[0])
        //console.log(cities[0], isFarEnough)

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

  const getCoordinates = async (locationState) => {
    const baseUrl = 'https://api.darksky.net/forecast/';

    console.log('in get coords')
    let hasUpdated = false
    let coordPromises = await Promise.all(locationState.map(async (place, index) => {
      //console.log('inside PROMISE')
      try {
        //console.log('trying fetch')
        let res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place.address}&key=${GOOGLE_GEOCODING_API_KEY}`)
        //console.log(res)
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
      //console.log("HHHHERRRREEEEEEEEEEE")
    }));
    coordPromises = coordPromises.filter(x => x != null);


    try {
      const departureCoordinates = getDepartureCoordinates(coordPromises);
      const destinationCoordinates = getDestinationCoordinates(coordPromises);
      let res = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${departureCoordinates.lat},${departureCoordinates.lng}&destination=${destinationCoordinates.lat},${destinationCoordinates.lng}&key=${GOOGLE_GEOCODING_API_KEY}`);
      var latlngs = polyUtil.decode(res.data.routes[0].overview_polyline.points);
      ob_ = polylineToCoordinateObject(latlngs)
      //console.log(latlngs, ob_)
      newlat = coordinateObjectToPolyline(cityDistanceThreshold(ob_, getDepartureCoordinates(coordPromises), []))
      //console.log(newlat)
      new WeatherDatabase('test.db').createRoutesTable(
        {
          latlngs: latlngs,
          departure_location: getDepartureLocation(coordPromises),
          destination_location: getDestinationLocation(coordPromises)
        }
      );
      let nearbyPlaces = await Promise.all(newlat.map(async (place) => {
        try {
          let res = await axios.get(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${place[0]}&lng=${place[1]}&cities=cities10000&radius=20&username=wits`);
          if (res.data) {
            if (res.data.geonames) {
              if (res.data.geonames[0]) {
                if (res.data.geonames[0].name) {
                  //console.log(res.data.geonames[0].lat, res.data.geonames[0].name, place)
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
      nearbyPlaces = nearbyPlaces.filter(x => x != null);
      console.log('here')
      //console.log('NEEARBY PLACES', nearbyPlaces)
      nearbyPlaces.push({ id: '-1', name: getDestinationLocation(coordPromises), address: '', coordinates: getDestinationCoordinates(coordPromises) })

      var citiesSpacedByThreshold = cityDistanceThreshold(nearbyPlaces, getDepartureCoordinates(coordPromises), [])
      //setCitiesOnRoute(citiesSpacedByThreshold);
      citiesSpacedByThreshold.unshift(coordPromises.find(location => location.name == getDepartureLocation(coordPromises)))
      console.log(citiesSpacedByThreshold)
    } catch (err) {
      console.log(err);
    }


    let weatherDataPromises = await Promise.all(citiesSpacedByThreshold.map(async place => {
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

    getRouteTableSize(weatherDataPromises, coordPromises)

  };

  const getRouteTableSize = async (weatherDataPromises, coordPromises) => {
    console.log('in get route table size')
    console.log(weatherDataPromises)
    let weatherDb = new WeatherDatabase('test.db')
    let res = await weatherDb.createWeatherTable(weatherDataPromises);
    //let res1 = await new WeatherDatabase('test.db').printTable()
    // console.log(res1)
    // if(res1) {
    //   console.log(res1, weatherDataPromises.length)
    //   if (res1 == weatherDataPromises.length) {
    //     //deleteState()
    //     let param = getDepartureLocation(coordPromises).concat('-', getDestinationLocation(coordPromises))
    //     navigation.navigate('RootResults', { yoyo: param })
    //   }
    // }
    let param = getDepartureLocation(coordPromises).concat('-', getDestinationLocation(coordPromises))
    setLoading(false)
    navigation.navigate('RootResults', { yoyo: param })
  }

  const commitToTrip = () => {
    console.log('in commit')
    //setLocationData('location', '1', departureLocation.split(',')[0], departureLocation, {});
    //setLocationData('location', '-1', destinationLocation.split(',')[0], destinationLocation, {})
    //setDepartureLocation('')
    //setDestinationLocation('')
    setLoading(true)

    let locationState =
      [
        {
          id: '1',
          address: departureLocation,
          coordinates: {},
          name: departureLocation.split(',')[0]
        },
        {
          id: '-1',
          address: destinationLocation,
          coordinates: {},
          name: destinationLocation.split(',')[0]
        }
      ]

    getCoordinates(locationState)
    // let param = departureLocation.split(',')[0].concat('-', destinationLocation.split(',')[0])
    // navigation.navigate('RootResults', { yoyo: param })
    //console.log('CONTEXT', newState)
  };

  return (
    <View>
      {!loading
        ?<View style={styles.main}>
          <View style={styles.inputMain}>
            <View style={styles.departureStyle}>
              <View >
                <TextInput
                  placeholder='Departure Location'
                  style={styles.departureInput}
                  autoCorrect={false}
                  underlineColorAndroid={ focusDeparture ? BLUE : LIGHT_GRAY }
                  selectionColor={ focusDeparture ? BLUE : LIGHT_GRAY }
                  onFocus={() => setFocusDeparture(true)}
                  onBlur={() => setFocusDeparture(false)}
                  onChange={event => setDepartureLocation(event.nativeEvent.text)}
                  value={departureLocation}
                />
              </View>
              <View style={styles.buttonPairWrapper}>
                <View style={styles.buttonWrapper}>
                  <Button
                    buttonStyle={styles.dateTimeButtonStyle}
                    titleStyle={styles.titleStyle}
                    type='outline'
                    raised={true}
                    title='Date of Departure'
                    onPress={() => {datepicker('departure')}}
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    buttonStyle={styles.dateTimeButtonStyle}
                    titleStyle={styles.titleStyle}
                    type='outline'
                    raised={true}
                    title='Time of Departure'
                    onPress={() => {timepicker('departure')}}
                  />
                </View>
              </View>
            </View>
          { (departureDateTime.showDate || departureDateTime.showTime)
               && <RNDateTimePicker
                    value={departureDateTime.showDate
                            ? departureDateTime.date
                             : departureDateTime.time}
                    mode={departureDateTime.mode}
                    is24Hour={false}
                    display='default'
                    onChange={departureDateTimeEntered}
                  />
          }
          </View>
          <View style={styles.inputMain}>
            <TextInput
              placeholder='Destination Location'
              autoCorrect={false}
              style={styles.destinationInput}
              underlineColorAndroid={ focusDestination ? BLUE : LIGHT_GRAY }
              selectionColor={ focusDestination ? BLUE : LIGHT_GRAY }
              onFocus={() => setFocusDestination(true)}
              onBlur={() => setFocusDestination(false)}
              onChange={event => {setDestinationLocation(event.nativeEvent.text)} }
              value={destinationLocation}
            />
          <View style={styles.buttonPairWrapper}>
              <View style={styles.buttonWrapper}>
                <Button
                  buttonStyle={styles.dateTimeButtonStyle}
                  titleStyle={styles.titleStyle}
                  type='outline'
                  raised={true}
                  title='Date of Arrival'
                  onPress={() => datepicker()}
                />
              </View>
              <View style={styles.buttonWrapper}>
               <Button
                  buttonStyle={styles.dateTimeButtonStyle}
                  titleStyle={styles.titleStyle}
                  type='outline'
                  raised={true}
                  title='Time of Arrival'
                  onPress={() => timepicker()}
               />
             { (destinationDateTime.showDate || destinationDateTime.showTime)
                    && <RNDateTimePicker
                         value={destinationDateTime.showDate
                                 ? destinationDateTime.date
                                  : destinationDateTime.time}
                         mode={destinationDateTime.mode}
                         is24Hour={false}
                         display='default'
                         onChange={destinationDateTimeEntered}
                       />
               }
              </View>
            </View>
          </View>
          <View>
            <Button
              buttonStyle={styles.getInfoButtonStyle}
              titleStyle={{fontSize: 24}}
              title='Get Trip Info'
              variant='success'
              raised={true}
              onPress={() => {commitToTrip() ;console.log(
                departureLocation, ':',
                departureDateTime.date.toLocaleString("en-US", {timeZone: "America/New_York"}).slice(0,10), ',',
                departureDateTime.time.toLocaleString("en-US", {timeZone: "America/New_York"}).slice(11,16), '--',
                destinationLocation, ':',
                destinationDateTime.date.toLocaleString("en-US", {timeZone: "America/New_York"}).slice(0,10), ',',
                destinationDateTime.time.toLocaleString("en-US", {timeZone: "America/New_York"}).slice(11,16))
              }}
            />
          </View>
        </View>
        : <View style={styles.loadingStyle}><ActivityIndicator size='large' color='#FFF' /></View>}
      </View>
  );
};

const styles = StyleSheet.create({
  main: {
    margin: 12,
    marginTop: 64
  },
  loadingStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#1079C5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputMain: {
    marginBottom: 48
  },
  departureStyle: {
    height: 120,
    justifyContent: 'space-between'
  },
  departureInput: {
    height: 40,
    paddingLeft: 6,
    fontSize: 16,
  },
  destinationInput: {
    height: 40,
    paddingLeft: 6,
    fontSize: 16
  },
  dateTimeButtonStyle: {
    padding: 10,
  },
  titleStyle: {
    color: BLUE
  },
  buttonPairWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  buttonWrapper: {
    margin: 10
  },
  getInfoButtonStyle: {
    padding: 16,
    backgroundColor: '#1079C5',
  }
});

export default SearchScreen;
