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
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  let cameraRef = useRef<CameraView | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  // Handle image selection from the gallery
  const pickImage = async () => {
    setSelectedImage(null);
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
    setSelectedImage(null);
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");

    if (!hasPermission) {
      Alert.alert("Error", "Camera permissions are required to take a photo.");
      return;
    }
    setCameraOpen((prev) => !prev);
  };

  const takePic = async () => {
    if (!cameraRef.current) {
      Alert.alert("Error", "Camera not active");
      return;
    }
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };
    const takenPhoto = await cameraRef.current.takePictureAsync(options);
    if (takenPhoto) {
      setSelectedImage({
        uri: takenPhoto.uri,
        width: takenPhoto.width,
        height: takenPhoto.height,
        assetId: null,
        base64: takenPhoto.base64,
        fileSize: 0,
      });
      setCameraOpen(false);
    }
  };

  // Handle submitting the image
  const submitImage = async () => {

    if (!selectedImage) {
      Alert.alert("Error", "Please select or take a photo before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try{
    const res = await fetch("https://api.whatsthatdog.com/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: selectedImage.base64,
      }),
    });

    const data = await res.json();
    
    console.log(data);
  }
  catch (error) {
    console.error("Error:", error);
    setError("An error occurred. Please try again later.");
    setLoading(false);
  }
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
          <Text style={styles.header}>Find out "What's that dog?!"</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.body}>
            Take a photo or upload an image of the dog you want to identify. Our
            app will process it and provide you with detailed breed information. Please place the dog in the center of the picture as we may need to trim the image! The clearer the image and more of the dog in the image, the better the results
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
          <View style={styles.previewContainer}>
          <CameraView flash="off" style={styles.cameraPreview} facing="back" ref={cameraRef}>
            <View style={styles.cameraOverlay}>
              <TouchableOpacity onPress={takePic} style={styles.cameraButton}>
                <Text style={styles.buttonText}>Take Picture</Text>
              </TouchableOpacity>
            </View>
            <StatusBar />
          </CameraView>
          </View>
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
  cameraOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
  },
  cameraButton: {
    backgroundColor: "#5fadae",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
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
  cameraPreview:{
    width: '100%',
    height: 600,
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
