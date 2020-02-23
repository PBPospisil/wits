import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from './src/context/TripContext';
import SearchScreen from './src/screens/SearchScreen';
import RootResultsScreen from './src/screens/RootResultsScreen';
import LoadingScreen from './src/screens/LoadingScreen';


const navigator = createStackNavigator ({
  Search: SearchScreen,
  RootResults: RootResultsScreen,
  Loading: LoadingScreen
}, {
  initialRouteName: 'Loading',
  defaultNavigationOptions: {
    title: 'Weather your Trip',
    headerStyle: {
        backgroundColor: '#1079C5',
      },
      headerTintColor: '#FFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },

});

const App = createAppContainer(navigator);
export default () => {
  return (
    <Provider>
      <App />
    </Provider>
)};
