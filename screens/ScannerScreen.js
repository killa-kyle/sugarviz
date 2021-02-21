import React, { useState, useEffect } from "react"
import { Text, View, Button, StatusBar,StyleSheet } from "react-native"

import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from './HomeScreen'
// import ResultsScreen from './ResultsScreen'
import ResultsScreen from "./ResultsScreenVisual"
// import HomeScreen from "../components/sugarViz"

const Stack = createStackNavigator()


const ScannerScreen = ({ route, navigation }) => {
  return (
    <Stack.Navigator>
      
      <Stack.Screen    
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
      />
    </Stack.Navigator>
  )
}

export default ScannerScreen