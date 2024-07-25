// screens/ForgotPassword.js

import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (email) {
      try {
        const formData = new FormData();
        formData.append('email', email);

        const response = await fetch('http://your-backend-endpoint/forgotPassword.php', {
          method: 'POST',
          body: formData,
        });

        const data = await response.text();

        setMessage(data);
        setModalVisible(true);
      } catch (error) {
        setMessage('Failed to send password reset instructions. Please try again later.');
        setModalVisible(true);
        console.error('Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/img/appicon.png')} style={styles.logo} />
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>

      {/* Message Box */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.messageBox}>
            <Text style={styles.message}>{message}</Text>
            <Button title="OK" onPress={() => setModalVisible(false)} color="#5cb85c" />
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#5cb85c',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    color: '#5cb85c',
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  messageBox: {
    width: 300,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ForgotPassword;
