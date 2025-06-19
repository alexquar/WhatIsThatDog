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
  Modal,
  TextInput
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraView } from "expo-camera";
import { router } from "expo-router";


const UploadPage = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface Results {
    breed: string;
    breed_info: string;
  }
  const [createPost, setCreatePost] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  let cameraRef = useRef<CameraView | null>(null);
  const [description, setDescription] = useState("");
  const [dogName, setDogName] = useState("");
  const [location, setLocation] = useState("");

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
      exif: false,
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
    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage.uri,
      type: selectedImage.type || "image/jpeg",
      name: selectedImage.uri.split("/").pop() || "image.jpg", // Ensure the file name is extracted properly
    } as unknown as File);
    try {
      const res = await fetch("http://10.0.0.64:5000", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(false);
      setError(
        "An error occurred and your dog could not be identified. Please try again later."
      );
      Alert.alert("Error :(", error ?? "");
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
      setLoading(false);
      Alert.alert("Error :(", error ?? "");
    }
  };

  const handleCreatePost = async () => {
    if (!dogName || !location || !description) {
      Alert.alert("Error", "Please fill in all fields to create a post.");
      return;
    }
    setLoading(true);
        const formData = new FormData();
    formData.append("file", {
      uri: selectedImage?.uri,
      type: selectedImage?.type || "image/jpeg",
      name: selectedImage?.uri.split("/").pop() || "image.jpg", // Ensure the file name is extracted properly
    } as unknown as File);
    formData.append("dog_name", dogName);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("dog_breed", results?.breed || "");
    formData.append("date", new Date().toISOString());
    try {
      const response = await fetch("http://10.0.0.64:5000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Post created successfully!");
        setCreatePost(false);
        setDogName("");
        setLocation("");
        setDescription("");
        setResults(null);
        setSelectedImage(null);
        router.push("/feed");
      }
      else {
        Alert.alert("Error", "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "An error occurred while creating the post.");
    }
    setLoading(false);
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
            Please place the dog in the center of the picture. The clearer the
            image and more of the dog in the image, the better the results. Keep
            in mind our modal can make mistakes and can only handle 120
            different breeds which you can observe in the training data on the
            about page.{" "}
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
            <CameraView
              flash="off"
              style={styles.cameraPreview}
              facing="back"
              ref={cameraRef}
            >
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
            <Text style={styles.buttonSecondaryText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Dog Lovers</Text>
          <Text style={styles.footerText}>© 2024 What's That Dog?!</Text>
        </View>

        <Modal
          transparent={true}
          visible={results !== null}
          animationType="slide"
          onRequestClose={() => {
            setResults(null);
            setSelectedImage(null);
            setError(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: selectedImage?.uri }}
                  style={styles.previewImage}
                />
              </View>
              <Text style={styles.modalTitle}>
                {results?.breed}
              </Text>
              <Text style={styles.modalText}>{results?.breed_info}</Text>
              {
                createPost &&
                <View>
  <Text style={styles.subHeader}>Create a Post</Text>

  <View style={[styles.inputRow, {marginTop: 10}]}>
    <Text style={styles.label}>Name:</Text>
    <TextInput
      style={[styles.textInput, styles.inputGrow]}
      placeholder="Dog's Name"
      value={dogName}
      onChangeText={setDogName}
      placeholderTextColor={"#a9bcd4"}
    />
  </View>

  <View style={styles.inputRow}>
    <Text style={styles.label}>Location:</Text>
    <TextInput
      style={[styles.textInput, styles.inputGrow]}
      placeholder="Location"
      value={location}
      onChangeText={setLocation}
            placeholderTextColor={"#a9bcd4"}

    />
  </View>

  <View style={styles.inputRow}>
    <Text style={styles.label}>Description:</Text>
    <TextInput
      style={[styles.textInput, styles.inputGrow, {
        overflow: "scroll"
      }]}
      placeholder="Description"
      value={description}
      onChangeText={setDescription}
      placeholderTextColor={"#a9bcd4"}

    />
  </View>
</View>
              }
              <View style={styles.horizonalButtonContainer}>
                {!createPost &&
               <TouchableOpacity
                onPress={() => {
                  setCreatePost(true);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Create Post</Text>
              </TouchableOpacity>
                }
                {createPost &&
               <TouchableOpacity
                onPress={handleCreatePost}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>{
                  loading ? "Posting..." : "Post"
              }</Text>
              </TouchableOpacity>
                }
              <TouchableOpacity
                onPress={() => {
                  setResults(null);
                  setSelectedImage(null);
                  setError(null);
                  setCreatePost(false);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>{
                  !createPost ? "Close" : "Discard"
              }</Text>
              </TouchableOpacity>

                
                </View>
            </View>
          </View>
        </Modal>
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
  textInput: {
  height: 48,
  borderColor: "#a9bcd4",
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 12,
  marginBottom: 15,
  fontSize: 16,
  backgroundColor: "#fff",
 
},
inputRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
},
label: {
  fontSize: 16,
  color: "#040909",
  marginRight: 10,
},

inputGrow: {
  flex: 1,
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
    fontSize: 14,
    color: "#040909",
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "justify",
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  horizonalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginVertical: 10,
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
  cameraPreview: {
    width: "100%",
    height: 600,
    borderRadius: 10,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a9bcd4",
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#040909",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    minHeight: "50%",
    width: 300,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8492c1", // Change to match your theme
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#040909", // Text color, change as needed
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#5fadae", // Button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UploadPage;
