import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import WeatherDatabase from '../components/WeatherDatabase';
import MapSection from '../components/MapSection';
import LocationsForecastList from '../components/LocationsForecastList';
import { Context } from '../context/TripContext';


const RootResultScreen = ({ navigation }) => {
  const [edgeLocations, setEdgeLocations] = useState([])
  const [routePolyline, setRoutePolyline] = useState([])
  const [weatherSampleLocations, setWeatherSampleLocations] = useState([])
  const [dailyLocationWeather, setDailyLocationWeather] = useState([])
  const [onViewableCoordinates, setOnViewableCoordinates] = useState([])
  const [tripId, setTripId] = useState('')
  const [loading, setLoading] = useState(false)


  if(navigation.state) {
    console.log(navigation.state)
    if(navigation.state.params) {
      console.log(navigation.state.params)
      if(navigation.state.params.yoyo !== tripId) {
        setTripId(navigation.state.params.yoyo)
        console.log(navigation.state.params.yoyo, tripId)
        setLoading(true);

      }
    }
  }
  //
  // if(edgeLocations.length > 0){
  //   console.log(edgeLocations.find(location => location.id == '1'))
  //   console.log(edgeLocations.find(location => location.id == '1').city.concat('-', edgeLocations.find(location => location.id == '-1').city), tripId)
  //
  //   if(edgeLocations.find(location => location.id == '1').city.concat('-', edgeLocations.find(location => location.id == '-1').city) !== tripId){
  //   }
  // }

  const { setSearchScreenState } = useContext(Context);



  useEffect(() => {
    let isCancelled = false;

    const getCityNamesAndCoordinates = async () => {
      //setSearchScreenState('set_search_screen_state', false, '', '')

      let res = await new WeatherDatabase('test.db').getCityNamesAndCoordinates()
      console.log(res)
      const departure = res.find(place => place.id == '1')
      const arrival = res.find(place =>place.id == '-1')
      setEdgeLocations([ departure, arrival ])
      //setWeatherSampleLocations(res)
      //console.log(res.length)
      let weather = []
      res.map(async location => {
        setWeatherSampleLocations(
          {
            id: location.id,
            name:location.name,
            coordinates: location.coordinates
          }
        )
        let locationWeather = await new WeatherDatabase('test.db').getLocationDailyWeatherForecast(location.city_id);
        if(locationWeather){
          if(locationWeather[0]){
            if(locationWeather[0].weather){
              weather.push(
                  {
                    id: location.id,
                    city_id: location.city_id,
                    name: location.city,
                    data: JSON.parse(locationWeather[0].weather).data.daily.data,
                    coordinates: JSON.parse(location.coordinates)
                  }
                );
                if(weather.length == res.length){
                  setDailyLocationWeather(weather)
                };
            }
          }
        }
      })
    };

    getCityNamesAndCoordinates()

    return () => {
      isCancelled = true;
    };
  }, [tripId]);

  // let latitudeDelta;
  // let longitudeDelta;
  //
  // if(edgeLocations) {
  //   if(edgeLocations[0]){
  //     if(edgeLocations[0].coordinates){
  //       latitudeDelta = parseFloat(JSON.parse(edgeLocations[0].coordinates).lat - JSON.parse(edgeLocations[1].coordinates).lat)
  //       longitudeDelta = parseFloat(JSON.parse(edgeLocations[0].coordinates).lng - JSON.parse(edgeLocations[1].coordinates).lng)
  //       console.log(edgeLocations, latitudeDelta, longitudeDelta)
  //
  //     }
  //   }
  // }

  useEffect(() => {
    let isCancelled = false;

    const getRouteLatLngs = async () => {
      let res = await new WeatherDatabase('test.db').getRouteLatLngs()
      if(res) {
        if(res[0]) {
          if(res[0].latlngs) {
            console.log(res[0].latlngs)

            setRoutePolyline(JSON.parse(res[0].latlngs))
            setLoading(false)
          }
        }
      }
    }

    getRouteLatLngs()

    return () => {
      isCancelled = true;
    };
  }, [tripId]);



  if(dailyLocationWeather.length > 1) {
    console.log(dailyLocationWeather[dailyLocationWeather.length-1].name)
  }

  return(
    <View>
      {!loading
        ?<View style={styles.mainContainer}>
          <View style={styles.mapStyle}>
            {edgeLocations.length > 0 && routePolyline.length > 0
              ? <MapSection
                  edgeLocations={edgeLocations}
                  routePolyline={routePolyline}
                  weatherLocations={dailyLocationWeather}
                  viewableCoordinates={onViewableCoordinates}
                  tripId={tripId}
                />
                : null
            }
          </View>
          <View style={styles.forecastListStyle}>
            {dailyLocationWeather
              ? <LocationsForecastList
                  dailyLocationWeather={dailyLocationWeather}
                  onViewableItemsChanged={(item) => setOnViewableCoordinates(item) } />
                : <View style={styles.loadingStyle} ><ActivityIndicator size='large' color='#FFF' /></View>
            }
          </View>
        </View>
        : <View style={styles.loadingStyle} ><ActivityIndicator size='large' color='#FFF' /></View>}
      </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%'
  },
  mapStyle: {
    height:'42%'
  },
  forecastListStyle: {
    height: '58%'
  },
  loadingStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#1079C5',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default RootResultScreen;
