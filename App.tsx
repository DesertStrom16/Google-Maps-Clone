import React from 'react';
import {Platform, LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/app/store';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Map from './src/screens/Map';
import Search from './src/screens/Search';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

type RootStackParamList = {
  Map: undefined;
  Search: undefined;
};

LogBox.ignoreLogs([
  "Seems like you're using an old API with gesture components",
]);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{flex: 1}}>
        <GestureHandlerRootView style={{flex: 1, position: 'relative'}}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: Platform.OS === 'ios' ? 'fade' : 'slide_from_bottom',
              }}>
              <Stack.Screen name="Map" component={Map} />
              <Stack.Screen name="Search" component={Search} />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
