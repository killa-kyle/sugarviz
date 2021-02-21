import React, { useState, useEffect } from "react"
import { Provider } from 'react-redux';
import store from './redux/store'
import { Text, View, } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

   
import { Ionicons } from "@expo/vector-icons"

import ScannerScreen from './screens/ScannerScreen'
import SettingsScreen from './screens/SettingsScreen'

const Tab = createBottomTabNavigator()


const App = () => {





  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Scan') {
                    iconName = focused
                      ? 'scan-circle'
                      : 'scan-circle-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                style: {
                  height: 50,
                  backgroundColor: '#fff'
                },
                activeTintColor: 'blue',
                inactiveTintColor: 'gray',
              }}
            >
            <Tab.Screen name="Scan" component={ScannerScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App
