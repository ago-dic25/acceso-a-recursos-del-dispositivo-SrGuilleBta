import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { CameraView } from 'expo-camera';

export default function App() {
  const [permisos, setPermisos] = useState(null);
  const [foto, setFoto] = useState(null);
  const [tipoCamera, setTipoCamera] = useState('back');
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        const { status: cameraStatus } = await CameraView.requestCameraPermissionsAsync();

        setPermisos(cameraStatus === "granted" && mediaStatus === "granted");

        if (cameraStatus !== "granted" || mediaStatus !== "granted") {
          Alert.alert("Permisos requeridos", "Necesitas dar permisos de cámara y galería");
        }
      } catch (error) {
        setPermisos(true);
      }
    })();
  }, []);

  if (permisos === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }
  
  if (permisos === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Permisos denegados</Text>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef) {
      try {
        const datosFoto = await cameraRef.takePictureAsync();
        setFoto(datosFoto.uri);
        await MediaLibrary.createAssetAsync(datosFoto.uri);
        setTimeout(() => setFoto(null), 1000);
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const toggleCamara = () => {
    setTipoCamera(current => current === 'back' ? 'front' : 'back');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={tipoCamera}
        ref={setCameraRef}
      />

      <SafeAreaView style={styles.controlsContainer}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.button} onPress={toggleCamara}>
            <Text style={styles.buttonText}>Cambiar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={tomarFoto}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          
          <View style={styles.button} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    height: 80,
  },
  button: {
    padding: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
});