import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';

const About = () => {
  const openDatasetLink = () => {
    const url = 'https://www.kaggle.com/datasets/jessicali9530/stanford-dogs-dataset';
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.spacer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')} // Adjust the path as needed
            resizeMode="contain"
          />
          <Text style={styles.header}>About "What's That Dog?!"</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.body}>
            At *What's That Dog?!*, we’re passionate about connecting dog lovers with the knowledge they need.
            Our app uses advanced technology to identify dog breeds quickly and accurately.
          </Text>
          <Text style={styles.body}>
            By analyzing thousands of images, we trained our model to recognize over 120 breeds, helping users
            explore and learn about the amazing diversity in the dog world.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.subHeader}>How It Works:</Text>
          <Text style={styles.body}>
            Our app analyzes the picture of a dog you upload using a powerful tool that’s been trained to understand
            dog breeds. It works like teaching a student by showing them thousands of dog pictures, each labeled
            with its breed. Over time, it learned to recognize the unique features of different breeds, like
            their fur patterns, ear shapes, and more.
          </Text>
          <Text style={styles.body}>
            When you upload a photo, the image is sent to our system, which runs a doggy identifying "brain" (our model)
            that compares it with what it has learned. Within moments, it tells you the breed along with
            some information about it.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.subHeader}>How We Built It:</Text>
          <Text style={styles.body}>
            To make this possible, we used advanced image recognition techniques. This process took place on a platform designed to
            teach computers to recognize patterns—similar to how you might teach someone to recognize
            different types of flowers or cars.
          </Text>
          <Text style={styles.body}>
            Once the model was ready, we connected it to our app using our own webserver, so make sure you're connected to the internet for this to work. This lets you send
            your dog photos directly to the model, which then processes them and provides results. 
          </Text>
        </View>

        <View style={styles.datasetSection}>
          <Text style={styles.footerHeader}>Our Training Data:</Text>
          <Text style={styles.body}>
            The app was trained on a robust and accurately labeled dataset from
            trusted sources. Want to know more? Visit the dataset page below.
          </Text>
          <TouchableOpacity style={styles.button} onPress={openDatasetLink}>
            <Text style={styles.buttonText}>View Training Dataset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Dog Lovers for Dog Lovers</Text>
          <Text style={styles.footerText}>© 2024 What's That Dog?!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
      footerHeader: {   
        fontSize: 20,
        fontWeight: 'bold',
        color: '#a9bcd4',
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
  datasetSection: {
    marginVertical: 20,
    alignItems: 'center',
}
});

export default About;

