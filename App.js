import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Update the import paths to point to the correct location
import SignUpScreen from './component/signUp';
import LoginScreen from './component/login';
import ForgotPasswordScreen from './component/forgetPassword';

const HomeScreen = ({ navigation }) => {
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

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
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
