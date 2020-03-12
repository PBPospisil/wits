import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from './src/context/TripContext';
import SearchScreen from './src/screens/SearchScreen';
import RootResultsScreen from './src/screens/RootResultsScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import { createDrawerNavigator } from 'react-navigation-drawer';


export const Drawer = createDrawerNavigator({
  SearchOuter: {
    screen: SearchScreen
  },
  Results: {
    screen: createStackNavigator ({

      RootResults: {
        screen: RootResultsScreen
      }

    }, { headerMode: 'none' } )
  }
}, { initialRouteName: 'SearchOuter', headerMode: 'none' } );

const navigator = createStackNavigator ({
  RootResults: RootResultsScreen,
  Loading: LoadingScreen,
  Drawer: {
    screen: Drawer
  }
}, {
  initialRouteName: 'Drawer',
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
