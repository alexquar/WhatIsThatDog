import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraView } from "expo-camera";
const UploadPage = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  let cameraRef = useRef<typeof Camera | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  // Handle image selection from the gallery
  const pickImage = async () => {
    setCameraOpen(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  // Handle taking a photo with the camera
  const prepTakePic = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");

    if (!hasPermission) {
      Alert.alert("Error", "Camera permissions are required to take a photo.");
      return;
    }
    setCameraOpen((prev) => !prev);
  };

  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    // let newPhoto = await cameraRef.current?.takePictureAsync(options);
    // setSelectedImage(newPhoto);
  };

  // Handle submitting the image
  const submitImage = () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select or take a photo before submitting.");
      return;
    }

    // Simulate sending the image to the backend
    Alert.alert(
      "Processing",
      "Your image is being sent to the server for analysis."
    );
    console.log("Image URI:", selectedImage);

    // Here, you would implement the actual POST request to your backend
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.spacer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")} // Adjust the path as needed
            resizeMode="contain"
          />
          <Text style={styles.header}>Upload a Dog Photo</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.body}>
            Take a photo or upload an image of the dog you want to identify. Our
            app will process it and provide you with detailed breed information.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.subHeader}>Provide an image:</Text>
          <TouchableOpacity style={styles.button} onPress={prepTakePic}>
            <Text style={styles.buttonText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>

        {cameraOpen && (
          <CameraView style={styles.previewContainer} facing="front">
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={takePic} style={styles.button}>
                <Text style={styles.buttonText}>Take Picture</Text>
              </TouchableOpacity>
            </View>
            <StatusBar />
          </CameraView>
        )}

        {selectedImage && (
          <View style={styles.previewContainer}>
            <Text style={styles.subHeader}>Preview:</Text>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.previewImage}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Text style={styles.subHeader}>Check what's that dog:</Text>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={submitImage}
          >
            <Text style={styles.buttonSecondaryText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Dog Lovers</Text>
          <Text style={styles.footerText}>© 2024 What's That Dog?!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfdfd",
    padding: 10,
  },
  spacer: {
    margin: 20,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8492c1",
    textAlign: "center",
  },
  introSection: {
    marginVertical: 15,
  },
  body: {
    fontSize: 16,
    color: "#040909",
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "justify",
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#5fadae",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: "#a9bcd4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonSecondaryText: {
    color: "#040909",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a9bcd4",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#040909",
  },
});

export default UploadPage;
