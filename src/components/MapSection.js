import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

const MapSection = (props) => {

  console.log('The map is getting value', props.viewableCoordinates)

  // latitude: parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat) - parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat - JSON.parse(props.edgeLocations[1].coordinates).lat)/2,
  // longitude: parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lng) - parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lng - JSON.parse(props.edgeLocations[1].coordinates).lng)/2,
  // latitudeDelta: parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat - JSON.parse(props.edgeLocations[1].coordinates).lat) * 1.55,
  // longitudeDelta: parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lng - JSON.parse(props.edgeLocations[1].coordinates).lng)

  const [tripId, setTripId] = useState('')
  const [region,setRegion] = useState(
    {
      latitude: (parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat) + parseFloat(JSON.parse(props.edgeLocations[1].coordinates).lat)) / 2,
      longitude: (parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lng) + parseFloat(JSON.parse(props.edgeLocations[1].coordinates).lng)) / 2,
      latitudeDelta: Math.abs(parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat) - parseFloat(JSON.parse(props.edgeLocations[1].coordinates).lat)) * 2,
      longitudeDelta: 2
    })
  const [edgeLocations, setEdgeLocations] = useState([])

  if(props.edgeLocations !== edgeLocations) {
    setEdgeLocations(props.edgeLocations)
    setRegion(
      {
        latitude: (parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat) + parseFloat(JSON.parse(props.edgeLocations[1].coordinates).lat)) / 2,
        longitude: (parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lng) + parseFloat(JSON.parse(props.edgeLocations[1].coordinates).lng)) / 2,
        latitudeDelta: Math.abs(parseFloat(JSON.parse(props.edgeLocations[0].coordinates).lat) - parseFloat(JSON.parse(props.edgeLocations[1].coordinates).lat)) * 2,
        longitudeDelta: 2
      }
    )

  }
  console.log(region)

  // const onRegionChange = (new_region) => {
  //   if(props.tripId !== tripId) {
  //     setTripId(props.tripId);
  //
  //     console.log('EDGE LOCATIONS ', props.edgeLocations)
  //     if(region.latitude !== new_region.latitude && region.longitude !== new_region.longitude) {
  //       console.log('CHANGING REGION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! from ', region, 'to ', new_region)
  //       setRegion(new_region)
  //     }
  //   }
  // }

  const formatRouteToLatLngs = (route) => {
    let LatLngs = [];
    route.map(coordinate => {
      LatLngs.push(formatCoordinateToLatLngs(coordinate));
    });
    return LatLngs
  };

  const formatCoordinateToLatLngs = (coordinate) => {
    return { latitude: coordinate[0], longitude: coordinate[1] }
  }

  return(
    <View>
      <MapView style={{height:'100%'}}
        region={region}>

          <Polyline
            coordinates={formatRouteToLatLngs(props.routePolyline)}
            strokeWidth={8}
            strokeColor='lightgreen'

          />
          <Marker
            coordinate={formatCoordinateToLatLngs(props.routePolyline[0])}
            description='same old shitty weather as always'
            title='Todays Weather'
          />
          <Marker
            coordinate={formatCoordinateToLatLngs(props.routePolyline[props.routePolyline.length-1])}
          />
        {props.viewableCoordinates.lat
            ? <Marker
               key={props.viewableCoordinates.lat.toString()}
               coordinate={formatCoordinateToLatLngs([parseFloat(props.viewableCoordinates.lat), parseFloat(props.viewableCoordinates.lng)])}>

              </Marker>
            : null
          }
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MapSection;
