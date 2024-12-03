import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
const Index = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.spacer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')} // Adjust the path as needed
            resizeMode='contain'
          />
          <Text style={styles.header}>Welcome to "What's That Dog!?"</Text>
        </View>
        
        <View style={styles.introSection}>
          <Text style={styles.body}>
            Ever see a dog and ask yourself, "What's that dog?" You're in the right place! 
            Our specialized Machine Learning model can identify the breed of any dog you spot.
          </Text>
          <Text style={styles.body}>
            With a training set of thousands of images spanning 120 dog breeds, we ensure you get
            accurate and detailed information about your furry friends. Upload a picture, and let us do the rest!
          </Text>
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={styles.subHeader}>How we work:</Text>
          <Text style={styles.featureItem}>🐶 Identify over 120 dog breeds instantly</Text>
          <Text style={styles.featureItem}>📸 Upload a photo directly from your gallery or take a pic with your camera</Text>
          <Text style={styles.featureItem}>📚 Get detailed information about the breed</Text>
          <Text style={styles.featureItem}>🌟 Easy-to-use interface for all dog lovers</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
          onPress={() => router.navigate('/(tabs)/upload')}
          style={styles.button}>
            <Text style={styles.buttonText}>Upload a Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => router.navigate('/(tabs)/about')}
          style={styles.buttonSecondary}>
            <Text style={styles.buttonSecondaryText}>Learn More</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Dog Lovers for Dog Lovers</Text>
          <Text style={styles.footerText}>© 2024 What's That Dog?!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfdfd',
    padding: 10,
  },
  spacer:{
    margin: 20,

  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8492c1',
    textAlign: 'center',
  },
  introSection: {
    marginVertical: 15,
  },
  body: {
    fontSize: 16,
    color: '#040909',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'justify',
  },
  featuresSection: {
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5fadae',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#444',
    marginVertical: 5,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5fadae',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#a9bcd4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonSecondaryText: {
    color: '#040909',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#040909',
  },
});

export default Index;
