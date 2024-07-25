import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (username && password) {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://your-backend-endpoint/login.php', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          navigation.navigate('Home'); // Redirect to Home screen
        } else {
          setErrorMessage(data.message || 'Failed to login. Please try again.');
          setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 2 seconds
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 2 seconds
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/img/appicon.png')} style={styles.logo} />
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={[styles.button, username && password ? styles.buttonEnabled : styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!username || !password}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.770)',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 300,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  button: {
    width: 300,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonEnabled: {
    backgroundColor: '#5cb85c',
  },
  buttonDisabled: {
    backgroundColor: 'lightgrey',
  },
  buttonText: {
    color: 'white',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: '#5cb85c',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignIn;
