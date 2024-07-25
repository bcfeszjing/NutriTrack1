import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (username && email && password) {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('http://your-backend-endpoint/signUp.php', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          navigation.navigate('Login'); // Redirect to Login screen
        } else {
          setErrorMessage(data.message || 'Failed to sign up. Please try again.');
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
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        style={[styles.button, username && email && password ? styles.buttonEnabled : styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!username || !email || !password}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
  },
});

export default SignUp;
