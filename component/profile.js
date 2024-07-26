import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Modal, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ProfileScreen = ({ navigation }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [username, setUsername] = useState('Loading...');
    const [email, setEmail] = useState('Loading...');
    const [password, setPassword] = useState('********');
    const [gender, setGender] = useState('Select Gender');
    const [birthDate, setBirthDate] = useState('Select Birth Date');
    const [age, setAge] = useState('Enter Age');
    const [height, setHeight] = useState('Enter Height');
    const [weight, setWeight] = useState('Enter Weight');
    const [showPicModal, setShowPicModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [showBirthDateModal, setShowBirthDateModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedBirthDate, setSelectedBirthDate] = useState('');

    useEffect(() => {
        // Fetch user data
        fetch('/NutriTrack/www/php/getUserData.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    setUsername(data.username);
                    setEmail(data.email);
                    setPassword('*'.repeat(data.passwordLength));
                    setWeight(data.weight || 'Enter Weight');
                    setHeight(data.height || 'Enter Height');
                    setGender(data.gender || 'Select Gender');
                    setBirthDate(data.birth_date || 'Select Birth Date');
                    setAge(data.age || 'Enter Age');
                    if (data.profile_picture) {
                        setProfilePic({ uri: `data:image/jpeg;base64,${data.profile_picture}` });
                    } else {
                        setProfilePic(require('./path-to-default-profile-pic.png')); // Default profile picture
                    }
                }
            })
            .catch(error => console.error('Fetch Error:', error));
    }, []);

    const chooseProfilePicture = () => {
        setShowPicModal(true);
    };

    const handleImagePicker = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });
            if (!result.canceled) {
                setProfilePic({ uri: result.uri });
                // Handle saving profile picture to the server
                // saveUserData('profile_picture', result.uri);
            }
        } else {
            Alert.alert('Permission required', 'Please grant permission to access the photo library.');
        }
        setShowPicModal(false);
    };

    const handleCamera = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });
            if (!result.canceled) {
                setProfilePic({ uri: result.uri });
                // Handle saving profile picture to the server
                // saveUserData('profile_picture', result.uri);
            }
        } else {
            Alert.alert('Permission required', 'Please grant permission to access the camera.');
        }
        setShowPicModal(false);
    };

    const handleRemovePhoto = () => {
        setProfilePic(require('./path-to-default-profile-pic.png')); // Default profile picture
        // Handle removing profile picture from the server
        // saveUserData('profile_picture', null);
        setShowPicModal(false);
    };

    const handleSavePassword = () => {
        if (newPassword) {
            // Save new password to the server
            // saveUserData('password', newPassword, true);
            setPassword('*'.repeat(newPassword.length));
            setShowPasswordModal(false);
        } else {
            Alert.alert('Validation', 'Please enter a new password.');
        }
    };

    const handleSaveGender = () => {
        if (selectedGender) {
            setGender(selectedGender);
            // Save gender to the server
            // saveUserData('gender', selectedGender);
            setShowGenderModal(false);
        } else {
            Alert.alert('Validation', 'Please select a gender.');
        }
    };

    const handleSaveBirthDate = () => {
        if (selectedBirthDate) {
            setBirthDate(selectedBirthDate);
            const age = calculateAge(selectedBirthDate);
            setAge(age);
            // Save birth date and age to the server
            // saveUserData('birth_date', selectedBirthDate);
            // saveUserData('age', age);
            setShowBirthDateModal(false);
        } else {
            Alert.alert('Validation', 'Please enter a valid birth date.');
        }
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return '';
        const birthDateObj = new Date(birthDate);
        const ageDifMs = Date.now() - birthDateObj.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profilePicFrame}>
                <Image source={profilePic} style={styles.profilePic} />
                <Button title="Change Profile Picture" onPress={chooseProfilePicture} />
            </View>
            <View style={styles.profileDetails}>
                <ProfileField label="Username" value={username} onEdit={() => Alert.alert('Edit Username')} />
                <ProfileField label="Email" value={email} onEdit={() => Alert.alert('Edit Email')} />
                <ProfileField label="Password" value={password} onEdit={() => setShowPasswordModal(true)} />
                <ProfileField label="Gender" value={gender} onEdit={() => setShowGenderModal(true)} />
                <ProfileField label="Birth Date" value={birthDate} onEdit={() => setShowBirthDateModal(true)} />
                <ProfileField label="Age" value={age} />
                <ProfileField label="Height (cm)" value={height} onEdit={() => Alert.alert('Edit Height')} />
                <ProfileField label="Weight (kg)" value={weight} onEdit={() => Alert.alert('Edit Weight')} />
                <Button title="Logout" onPress={() => navigation.navigate('Login')} />
            </View>
            {/* Modals */}
            <Modal visible={showPicModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Button title="Choose from Library" onPress={handleImagePicker} />
                        <Button title="Take a Photo" onPress={handleCamera} />
                        <Button title="Remove Photo" onPress={handleRemovePhoto} />
                        <Button title="Close" onPress={() => setShowPicModal(false)} />
                    </View>
                </View>
            </Modal>
            <Modal visible={showPasswordModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            secureTextEntry={true}
                            placeholder="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={styles.input}
                        />
                        <Button title="Save" onPress={handleSavePassword} />
                        <Button title="Close" onPress={() => setShowPasswordModal(false)} />
                    </View>
                </View>
            </Modal>
            <Modal visible={showGenderModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Select Gender</Text>
                        <TouchableOpacity onPress={() => setSelectedGender('Male')}>
                            <Text>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedGender('Female')}>
                            <Text>Female</Text>
                        </TouchableOpacity>
                        <Button title="Save" onPress={handleSaveGender} />
                        <Button title="Close" onPress={() => setShowGenderModal(false)} />
                    </View>
                </View>
            </Modal>
            <Modal visible={showBirthDateModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="YYYY-MM-DD"
                            value={selectedBirthDate}
                            onChangeText={setSelectedBirthDate}
                            style={styles.input}
                        />
                        <Button title="Save" onPress={handleSaveBirthDate} />
                        <Button title="Close" onPress={() => setShowBirthDateModal(false)} />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const ProfileField = ({ label, value, onEdit }) => (
    <View style={styles.profileField}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
        {onEdit && <Button title="Edit" onPress={onEdit} />}
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    profilePicFrame: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileDetails: {
        marginBottom: 20,
    },
    profileField: {
        marginBottom: 15,
    },
    fieldLabel: {
        fontWeight: 'bold',
    },
    fieldValue: {
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 5,
    },
});

export default ProfileScreen;
