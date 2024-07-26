import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import SignUpScreen from './component/signUp';
import LoginScreen from './component/login';
import ForgotPasswordScreen from './component/forgetPassword';
import Home from './component/home'; // Import the new Home screen

const WelcomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/img/appicon.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Nutrition Tracker</Text>
      <View style={styles.buttonFrame}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Nutrition = () => (
  <View>
    <Text>Nutrition Page</Text>
  </View>
);

const Report = () => (
  <View>
    <Text>Report Page</Text>
  </View>
);

const Profile = () => (
  <View>
    <Text>Profile Page</Text>
  </View>
);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Nutrition" component={Nutrition} />
        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundImage: `url(${require('./assets/img/nutrition-background.png')})`, // Note: React Native does not support background images this way
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonFrame: {
    alignItems: 'center',
    marginTop: 20,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
