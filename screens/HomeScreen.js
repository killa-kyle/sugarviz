import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { View, StyleSheet, Text, StatusBar, Image } from "react-native"
import AppButton from '../components/AppButton/AppButton'
import { SafeAreaProvider } from "react-native-safe-area-context"
import SafeAreaView from "react-native-safe-area-view"
import {startScanning, stopScanning, getNutrition, getNutritionSuccess, getNutritionFailure, fetchNutrition, scanSuccess} from '../redux/scanner/scanner.actions'
import { BarCodeScanner } from "expo-barcode-scanner"

const HomeScreen = ({ 
  route,
  navigation,
 
 }) => {
  
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


  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [product, setProduct] = useState({})
  const [result, setResult] = useState(null)

  // check for camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === "granted")
      dispatch(startScanning()) // tell reudux that we're scanning for barcode now
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (scanResult) {
        console.log("scan result", scanResult)
        // const productData = await fetchNutrition(result)
        // setProduct(productData)
        dispatch(fetchNutrition(scanResult))
        setScanned(false) 
      }
    })()
  }, [scanResult])


  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true) // disable scanner
    await dispatch(scanSuccess(data))    
    console.log("scanned", data)
    navigation.navigate("Results")
    
  }

  // Check for device permission
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }


  const productImage = currentProduct?.product?.image_url
  const productName = currentProduct?.product?.product_name

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        title="Scan a barcode to begin"
        options={{
          headerStyle: {
            backgroundColor: "rgba(255,229,0,1)",
          },
          style: {
            color: "red",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "300",
          },
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "start",
          alignItems: "center",
          backgroundColor: "#f8f8f8",
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{
            position: "relative",
            left: 0,
            right: 0,
            top: 12,
            // position: "fixed",
            width: "95%",
            borderRadius: "12px",
            overflow: "hidden",
            height: 400,
            marginBottom: 40,
          }}
        />
        {scanned ? (
          <>
            <AppButton
          title="Scan another item"
          onPress={() => setScanned(false) } />
          </>
          ): null}
        {currentProduct.product ? (
          <>
            <Text>Product: {productName}</Text>
            <Image source={{ uri: productImage }}></Image>
            <Text>UPC: {scanResult}</Text>
            <Text>is scanning: {scanned ? "no" : "yes"}</Text>
          </>
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  )

}





  export default HomeScreen