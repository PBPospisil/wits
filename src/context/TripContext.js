import { useReducer } from 'react';
import createDataContext from './createDataContext';

const tripReducer = (state, action) => {
 switch (action.type) {
   case 'set_location_data':
    return [...state,
      {
        id : action.payload.id,
        name: action.payload.name,
        address: action.payload.address,
        coordinates: action.payload.coordinates
      }
    ];
   case 'edit_location_data':
    return state.map((location) => {
      return location.name === action.payload.name
              ? action.payload
                : location
    });
  }
};

const setLocationData = dispatch => {
  return (id, name, address, coordinates, callback) => {
    dispatch({ type: 'set_location_data', payload: { id: id, name: name, address: address, coordinates: coordinates } });
    if (callback) {
      callback();
    }
  };
};

const editLocationData = dispatch => {
  return (id, name, address, coordinates, callback) => {
    dispatch({ type: 'edit_location_data', payload: { id: id, name: name, address: address, coordinates: coordinates } });
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  tripReducer,
  { setLocationData, editLocationData},
  []
);
