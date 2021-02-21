import React, { useState, useEffect } from "react"
import { Text, View,ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import {
  Header,  
  Card,
  ListItem, Avatar, 
  Button,
  Icon,
} from "react-native-elements"


import { BarCodeScanner } from "expo-barcode-scanner"
import AppButton from "./components/AppButton/AppButton"
import logo from './assets/icon.png'

const App = () => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [product, setProduct] = useState({})
  const [result, setResult] = useState("...")
  

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true)
    
    const productData = await fetchNutrition(data)
    if(productData){
      setProduct(productData)
    }
    // console.log(productData.product)

  }


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  const fetchNutrition = async (upc) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${upc}.json`
      )
      const data = await response.json()

      return data
    } catch (error) {
      console.log("error")
    }
  }
  const IntroScreen = () => (
    <View style={styles.container}>
      {/* Barcode Scanner */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {/* Footer Menu */}
      
    </View>
  )
  const ResultScreen = () => {
    const list = [
      {
        name: "Amy Farha",
        avatar_url:
          "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
        subtitle: "Vice President",
      },
      {
        name: "Chris Jackson",
        avatar_url:
          "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
        subtitle: "Vice Chairman",
      },
      {
        name: "Chris Jackson",
        avatar_url:
          "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
        subtitle: "Vice Chairman",
      },
      {
        name: "Chris Jackson",
        avatar_url:
          "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
        subtitle: "Vice Chairman",
      },
    ]
    const productImage = product?.product?.image_url
    const productName = product?.product?.product_name
    return (
      <ScrollView style={styles.ResultContainer}>
        {console.log(productImage)}
        {console.log(productName)}

        <Card style={{}}>
          <Card.Title>{productName}</Card.Title>
          <Card.Divider />
          <Card.Image source={{ uri: productImage }}></Card.Image>
          <Text style={{ ...styles.resultText, marginBottom: 40 }}>
            contains {product?.product?.nutriments?.sugars_value} grams of sugar
            in each serving
          </Text>
          <AppButton
            title={"Scan another item"}
            style={{ marginBottom: 15 }}
            onPress={() => {
              setScanned(false)
              setProduct({})
            }}
          />
        </Card>
        <Card containerStyle={{ padding: 0 }}>
          <Card.Divider />
          <Card.Title>History</Card.Title>
          {list.map((l, i) => (
            <ListItem key={i} bottomDivider>
              <Avatar source={{ uri: l.avatar_url }} />
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
                <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </Card>
      </ScrollView>
    )
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Top Bar */}
        <Header
          placement="left"
          backgroundColor="rgba(255,229,0,1)"
          barStyle="dark-content"
          containerStyle={{ display: 'flex', }}
          leftComponent={{ icon: "menu", color: "#333" }}
          centerComponent={{
            text: "SugarViz (alpha)",
            style: { color: "#333", fontWeight:'700', },
          }}
          // rightComponent={{ icon: "home", color: "#333" }}
        />
        {/* <View style={styles.topBar}>
          <Image source={logo} style={styles.image} />
          <Text style={styles.topBarText}>
            Scan a barcode to begin!
          </Text>
        </View> */}
        {!scanned && (
          <>
            <IntroScreen />
          </>
        )}

        {/* scanned with no result */}
        {scanned && !product && (
          <AppButton
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        )}
        {/* scanned with a match */}
        {scanned && product && <ResultScreen />}
      </View>
    </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#000",
  },
  image: { width: 60, height: 60, position: "absolute", top: 0, left: 0 },
  topBar: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(255,229,0,1)",

    color: "rgba(0,0,0,1.0)",
    textAlign: "center",
    fontFamily: "Helvetica",
    padding: 15,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 99,
  },
  topBarText: {
    position: "relative",
    left: 80,
  },
  scanner: {
    // ...StyleSheet.absoluteFillObject,
    position: "absolute",
    bottom: "50%",
    left: 0,
    right: 0,
    top: 60,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    flexDirection: "row",
  },
  resultText: {
    color: "#333",
    fontSize: 24,
    // marginBottom: 40,
    padding: 20,
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  status: {
    color: "#fff",
    fontSize: 18,
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

export default App
