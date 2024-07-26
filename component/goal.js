import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Picker,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GoalScreen = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dietGoal, setDietGoal] = useState('maintain');
  const [rdi, setRdi] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/NutriTrack/www/php/getUserData.php');
      const data = await response.json();
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        setAge(data.age || '');
        setGender(data.gender || '');
        setWeight(data.weight || '');
        setHeight(data.height || '');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const calculateRDI = async () => {
    try {
      let bmr;
      if (gender.toLowerCase() === 'male') {
        bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
      } else if (gender.toLowerCase() === 'female') {
        bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
      } else {
        alert('Invalid gender specified.');
        return;
      }

      let activityFactor;
      switch (dietGoal) {
        case 'maintain':
          activityFactor = 1.2;
          break;
        case 'slow_gain':
          activityFactor = 1.3;
          break;
        case 'gain':
          activityFactor = 1.5;
          break;
        case 'slow_loss':
          activityFactor = 1.1;
          break;
        case 'loss':
          activityFactor = 0.9;
          break;
        default:
          activityFactor = 1.2;
          break;
      }

      const calculatedRdi = Math.round(bmr * activityFactor);
      setRdi(calculatedRdi);
      await updateRDI(calculatedRdi);
    } catch (error) {
      console.error('Error calculating RDI:', error);
    }
  };

  const updateRDI = async (rdiValue) => {
    try {
      const response = await fetch('/NutriTrack/www/php/updateRDI.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rdi: rdiValue }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('RDI updated successfully');
      } else {
        console.error('Failed to update RDI:', data.message);
      }
    } catch (error) {
      console.error('Error updating RDI:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigator}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>My Goals</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calculate your RDI</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Enter Age"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender:</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Select Gender"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Weight:</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Enter Weight"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Height:</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="Enter Height"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Diet Goal:</Text>
          <Picker
            selectedValue={dietGoal}
            style={styles.input}
            onValueChange={(itemValue) => setDietGoal(itemValue)}
          >
            <Picker.Item label="Maintain my current weight" value="maintain" />
            <Picker.Item label="Slow weight gain" value="slow_gain" />
            <Picker.Item label="Weight gain" value="gain" />
            <Picker.Item label="Slow weight loss" value="slow_loss" />
            <Picker.Item label="Weight loss" value="loss" />
          </Picker>
        </View>

        <View style={styles.buttonGroup}>
          <Button title="Calculate" onPress={calculateRDI} />
        </View>

        {rdi && (
          <View style={styles.resultSection}>
            <Text style={styles.resultText}>
              Your Recommended Daily Intake (RDI) is: {rdi} kcal
            </Text>
            <View style={styles.buttonGroup}>
              <Button title="Save" onPress={saveResult} />
              <Button title="Recalculate" onPress={() => setRdi(null)} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  navigator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#555',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultSection: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default GoalScreen;
