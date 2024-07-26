// ResetPassword.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResetPassword = ({ route, navigation }) => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
        // Extract token from URL params
        const { token, message } = route.params || {};
        if (token) {
            setToken(token);
        }
        if (message) {
            Alert.alert('Message', decodeURIComponent(message), [{ text: 'OK' }]);
        }
    }, [route.params]);

    const handlePasswordReset = () => {
        // Perform password reset logic here
        // e.g., send a request to the server
        Alert.alert('Password Reset', 'Your password has been reset.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.label}>New Password:</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter new password"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <Button title="Reset Password" onPress={handlePasswordReset} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    formContainer: {
        width: 300,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        marginBottom: 8,
        color: '#333',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        padding: 8,
        fontSize: 16,
    },
});

export default ResetPassword;
