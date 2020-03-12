import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Picker, Image } from 'react-native';
import LocationForecastList from './LocationForecastList';
import map_marker from '../../assets/map_marker.png'
var moment = require('moment');


const LocationsForecastList = ({ dailyLocationWeather, onViewableItemsChanged }) => {

  const [dateSelected, setDateSelected] = useState(0);
  const [onViewableName, setOnViewableName] = useState([])


  const onViewRef = React.useRef((viewableItems)=> {
      console.log(viewableItems.changed[0].item.name)
      setOnViewableName(viewableItems.changed[0].item.name)
      onViewableItemsChanged(viewableItems.changed[0].item.coordinates)
      // Use viewable items in state or as intended
  })
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

  console.log('MOUNTING LOCATIONS LIST')

  const orderByTrip = (list) => {
    if (list.length > 2) {
      return list.push(list.splice(1,1)[0])
    } else {
      return list
    }
  }
  dailyLocationWeather[dailyLocationWeather.length-1]
    ? dailyLocationWeather[dailyLocationWeather.length-1].id == '-1'
      ? null
      : orderByTrip(dailyLocationWeather)
    : null
  return(
    <View style={styles.mainStyle}>
      <Picker
          selectedValue={dateSelected}
          style={styles.pickerStyle}
          onValueChange={(itemValue, itemIndex) => {
            console.log('SETTING DATE')
            setDateSelected(itemValue)
          }}>
          {dailyLocationWeather[0]
            ? dailyLocationWeather[0].data.map((day, dayNumber) => {
            console.log(dayNumber)
            return(
              <Picker.Item key={dayNumber} label={moment(new Date()).add(dayNumber, 'days').format('dddd, MMM Do YYYY')} value={dayNumber} />)
            })
            : null}
      </Picker>
      <FlatList
        data={dailyLocationWeather}
        key={ location => location.city_id.toString() }
        keyExtractor={ location => location.city_id.toString() }
        onViewableItemsChanged={onViewRef.current}

        viewabilityConfig={viewConfigRef.current}

        renderItem={({ item }) => {
          //console.log(item.name)
          return(
            <View>
              {item.id == '1' || item.id == '-1' || item.name == onViewableName
                ? item.name == onViewableName && (item.id != '-1' && item.id != '1')
                  ? <View style={styles.cityTextStyle}><Image source={map_marker} style={styles.mapMarkerStyle} ></Image></View>
                  : <Text style={styles.cityTextStyle}>{item.name}</Text>
                : <View style={styles.notViewableWaypointHeader}></View>}
              <LocationForecastList dailyWeather={item} initialDate={dateSelected} />
            </View>
          );
        }}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  cityTextStyle: {
    fontFamily: 'sans-serif',
    alignSelf: 'center',
    fontSize: 26,
    color: '#1079C5',
    fontWeight: 'bold',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    paddingBottom: 1
  },
  mainStyle: {
    backgroundColor: '#BDE1FF',
    paddingTop: 4,
    borderTopWidth: 5,
    borderColor: '#1079C5',
    paddingBottom: 50
  },
  pickerStyle: {
    height: 40,
    width: 230,
    marginLeft: 10,
    color: '#1079C5',
  },
  notViewableWaypointHeader: {
    height: 27
  },
  mapMarkerStyle: {
    width: 15,
    height: 26,
    justifyContent: 'center'
  }
});

export default LocationsForecastList;
