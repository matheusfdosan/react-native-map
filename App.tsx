import { useEffect, useRef, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { Text, View } from "react-native"
import { styles } from "./styles"

import MapView, { Marker } from "react-native-maps"

// Pedir permissão ao usuários para obter a localização (requestForegroundPermissionsAsync)
// Pegar a localização atual (getCurrentPositionAsync)
// Tipagem dos dados de localização (LocationObject)
// Acompanhar localização do usuário em tempo real (LocationAccuracy)
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location"

export default function App() {
  // "<LocationObject | null>" position terá a tipagem de LocationObject ou será nulo
  const [position, setPosition] = useState<LocationObject | null>(null)

  const mapRef = useRef(null)

  async function requestLocationPermition() {
    // granted = permissão dada pelo usuário
    const { granted } = await requestForegroundPermissionsAsync()

    if (granted) {
      const currentPosition = await getCurrentPositionAsync()
      setPosition(currentPosition)
    }
  }

  useEffect(() => {
    requestLocationPermition()

    // Acompanhar localização do usuário em tempo real
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setPosition(response)

        // Para seguir o marcador
        mapRef.current?.animateCamera({
          pitch: 70, // Altera a perspectiva
          center: response.coords, // Seguir o marcador (sempre centralizado)
        })
      }
    )
  }, [])

  return (
    <View style={styles.container}>
      {position && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }}
          />
        </MapView>
      )}
      <StatusBar style="dark" />
    </View>
  )
}
