import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import GetTripData from '../components/GetTripData';
import GoogleMapsPlacesSearch  from '../components/GoogleMapsPlacesSearch';
import { Context } from '../context/TripContext';


const BLUE = '#1079C5';
const LIGHT_GRAY = '#D3D3D3';

const SearchScreen = () => {

  const { setLocationData } = useContext(Context);

  const [getTrip, setGetTrip] = useState(false);

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

  const commitToTrip = () => {
    setGetTrip(true);
    setLocationData( '@', departureLocation.split(',')[0], departureLocation, {});
    setLocationData( '$', destinationLocation.split(',')[0], destinationLocation, {})
  };

  return (
    <View style={styles.main}>
      <View style={styles.inputMain}>
        <View style={styles.departureStyle}>
          <View >
            <TextInput
              placeholder='Departure Location'
              style={styles.departureInput}
              underlineColorAndroid={ focusDeparture ? BLUE : LIGHT_GRAY }
              selectionColor={ focusDeparture ? BLUE : LIGHT_GRAY }
              onFocus={() => setFocusDeparture(true)}
              onBlur={() => setFocusDeparture(false)}
              onChange={event => setDepartureLocation(event.nativeEvent.text)}
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
          style={styles.destinationInput}
          underlineColorAndroid={ focusDestination ? BLUE : LIGHT_GRAY }
          selectionColor={ focusDestination ? BLUE : LIGHT_GRAY }
          onFocus={() => setFocusDestination(true)}
          onBlur={() => setFocusDestination(false)}
          onChange={event => setDestinationLocation(event.nativeEvent.text)}
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
      {getTrip ? <GetTripData /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    margin: 12,
    marginTop: 64
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
