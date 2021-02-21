import React from "react"
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native"

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "rgba(255,229,0,1.0)",

    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  appButtonText: {
    fontSize: 18,
    color: "rgba(0,0,0,1.0)",
    fontWeight: "bold",
    alignSelf: "center",
    // textTransform: "uppercase"
  },
})
const AppButton = ({ onPress, title, style }) => (
  <TouchableOpacity onPress={onPress} style={{...styles.appButtonContainer, ...style}}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
)
export default AppButton