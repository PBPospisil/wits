import { useReducer } from 'react';
import createDataContext from './createDataContext';

const tripReducer = (state, action) => {
 switch (action.type) {
   case 'set_location_data':
    return [...state,
      {
        state_type: action.payload.state_type,
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
   case 'delete_state':
    return [];
   case 'set_search_screen_state':
    return [...state,
      {
        state_type: action.payload.state_type,
        getTrip: action.payload.getTrip,
        departureLocation: action.payload.departureLocation,
        destinationLocation: action.payload.destinationLocation
      }
    ];
   case 'set_get_trip_data_state':
    return [...state,
     {
       state_type: action.payload.state_type,
       has_updated: action.payload.has_updated
     }
    ];
   case 'set_get_route_state':
    return [...state,
     {
       state_type: action.payload.state_type,
       has_updated: action.payload.has_updated,
       ready_for_update: action.payload.has_updated
     }
    ];
   case 'edit_get_trip_data_state':
    return state.map(payload => {
      return payload.state_type === action.payload.state_type
              ? action.payload
                : payload
    });
   case 'edit_get_route_state':
     return state.map(payload => {
       return payload.state_type === action.payload.state_type
               ? action.payload
                 : payload
     });
  }
};

const setSearchScreenState = dispatch => {
  return (state_type, getTrip, departureLocation, destinationLocation, callback) => {
    dispatch({ type: 'set_search_screen_state',
               payload:
                {
                  state_type: state_type,
                  getTrip: getTrip,
                  departureLocation: departureLocation,
                  destinationLocation: destinationLocation
                }
              });
    if (callback) {
      callback();
    }
  }
}

const setGetTripDataState = dispatch => {
  return (state_type, has_updated, callback) => {
    dispatch({ type: 'set_get_trip_data_state', payload: {state_type: state_type, has_updated: has_updated} });
    if (callback) {
      callback();
    }
  }
}

const setGetRouteState = dispatch => {
  return (state_type, has_updated, ready_for_update, callback) => {
    dispatch({ type: 'set_get_route_state', payload: {state_type: state_type, has_updated: has_updated, ready_for_update: ready_for_update} });
    if (callback) {
      callback();
    }
  }
}

const deleteState = dispatch => {
  return (callback) => {
    dispatch({ type: 'delete_state', payload: {} });
    if (callback) {
      callback();
    }
  }
}

const setLocationData = dispatch => {
  return (state_type, id, name, address, coordinates, callback) => {
    dispatch({ type: 'set_location_data', payload: { state_type: state_type, id: id, name: name, address: address, coordinates: coordinates } });
    if (callback) {
      callback();
    }
  };
};

const editLocationData = dispatch => {
  return (state_type, id, name, address, coordinates, callback) => {
    dispatch({ type: 'edit_location_data', payload: { state_type: state_type, id: id, name: name, address: address, coordinates: coordinates } });
    if (callback) {
      callback();
    }
  };
};
const editGetTripDataState = dispatch => {
  return (state_type, has_updated, callback) => {
    dispatch({ type: 'edit_get_trip_data_state', payload: {state_type: state_type, has_updated: has_updated} });
    if (callback) {
      callback();
    }
  }
}
const editGetRouteState = dispatch => {
  return (state_type, has_updated, ready_for_update, callback) => {
    dispatch({ type: 'edit_get_route_state', payload: {state_type: state_type, has_updated: has_updated, ready_for_update: ready_for_update} });
    if (callback) {
      callback();
    }
  }
}

export const { Context, Provider } = createDataContext(
  tripReducer,
  { setLocationData, editLocationData, deleteState, setSearchScreenState, setGetTripDataState, setGetRouteState, editGetTripDataState, editGetRouteState },
  []
);
