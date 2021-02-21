import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { View, StyleSheet, Text, Button,Image } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AppButton from '../components/AppButton/AppButton'


const ResultsScreen = ({ route, navigation }) =>{ 
  const dispatch = useDispatch();

  //Access Redux Store State
  const scannerState = useSelector((state) => state.scanner)
  let {
    loading,
    hasErrors,
    isScanning,
    scanResult,
    products,
    currentProduct 
  } = scannerState 
  let { product, code, status_verbose:status } = currentProduct

  return (
    <View style={{ ...styles.container }}>
      <Text style={{ ...styles.resultText }}>
        
        {product?.product_name}
        {/* {JSON.stringify(product)} */}
        
      </Text>
      <Image
        source={{ uri: product?.image_url }}
        style={{...styles.resultImage}}
      ></Image>
      <Text style={{ ...styles.resultText }}>
        
        contains   {"\n"}<Text style={{...styles.resultSugarText}}> 
         { product?.nutriments?.sugars_value } 
        </Text>  {"\n"} grams of sugar in each serving
        
      </Text>

      <AppButton title="Scan another item" onPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  resultImage: { width: 300, height: 200, resizeMode: "contain", marginBottom: 0 },
  resultText: {
    color: "#333",
    fontSize: 24,
    marginBottom: 40,
    padding: 20,
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  resultSugarText: {
    fontWeight: "bold",
    flex: 1,
    fontSize: 32,
    margin: 15
  },
  status: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,229,0,0.9)",
    color: "rgba(0,0,0,1.0)",
    textAlign: "center",
    fontFamily: "Helvetica",
    padding: 15,
    flexDirection: "row",
    zIndex: 99,
  },
  
  ResultContainer: {
    backgroundColor: "#f8f8f8",    
    position: "relative",
    overflow: 'hidden',
    padding: 15,    
    height: '100%'
    }
})




export default ResultsScreen