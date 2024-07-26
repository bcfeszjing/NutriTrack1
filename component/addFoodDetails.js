import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddFoodDetails = ({ route }) => {
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [foodName, setFoodName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [foodDetails, setFoodDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const { category: routeCategory, date: routeDate } = route.params;
    setCategory(routeCategory.charAt(0).toUpperCase() + routeCategory.slice(1));
    setDate(routeDate);
  }, [route.params]);

  const fetchFoodDetails = async () => {
    const query = `${parseInt(servingSize)}g ${foodName}`;
    const apiKey = 'C88S0O73Y7LOimgVjnnAiA==BddFHkUwNFO1u7hd';
    const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${query}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'X-Api-Key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFoodDetails(data.items[0]);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const saveFoodDetails = async () => {
    const userId = sessionStorage.getItem('userId'); // Assuming user ID is stored in sessionStorage
    const foodDetailsToSave = {
      user_id: userId,
      category: category.toLowerCase(),
      date,
      food_name: foodName,
      serving_size: parseInt(servingSize),
      calories: foodDetails.calories,
      protein: foodDetails.protein_g,
      fat: foodDetails.fat_total_g,
      fiber: foodDetails.fiber_g,
      sugar: foodDetails.sugar_g,
      carbs: foodDetails.carbohydrates_total_g
    };

    try {
      const response = await fetch('http://your-backend-url/saveFoodDetails.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodDetailsToSave),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Food details saved successfully!', [{ text: 'OK', onPress: () => navigation.navigate('Nutrition') }]);
      } else {
        console.error('Error saving food details:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./assets/arrow.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Food</Text>
      </View>

      <View style={styles.formGroup}>
        <Text>Category:</Text>
        <TextInput style={styles.input} value={category} editable={false} />
      </View>
      <View style={styles.formGroup}>
        <Text>Date:</Text>
        <TextInput style={styles.input} value={date} editable={false} />
      </View>
      <View style={styles.formGroup}>
        <Text>Food Name:</Text>
        <TextInput style={styles.input} value={foodName} onChangeText={setFoodName} />
      </View>
      <View style={styles.formGroup}>
        <Text>Serving Size (g):</Text>
        <TextInput style={styles.input} value={servingSize} onChangeText={setServingSize} keyboardType="numeric" />
      </View>
      <Button title="Search" onPress={fetchFoodDetails} />

      {Object.keys(foodDetails).length > 0 && (
        <View style={styles.foodDetails}>
          <Text>Food Details</Text>
          <Text>Food Name: {foodDetails.name.charAt(0).toUpperCase() + foodDetails.name.slice(1)}</Text>
          <Text>Calories: {foodDetails.calories}</Text>
          <Text>Protein (g): {foodDetails.protein_g}</Text>
          <Text>Total Fat (g): {foodDetails.fat_total_g}</Text>
          <Text>Fiber (g): {foodDetails.fiber_g}</Text>
          <Text>Sugar (g): {foodDetails.sugar_g}</Text>
          <Text>Total Carbohydrates (g): {foodDetails.carbohydrates_total_g}</Text>
        </View>
      )}

      <Button title="Save" onPress={saveFoodDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  backButton: {
    width: 24,
    height: 24,
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  foodDetails: {
    marginTop: 20,
  },
});

export default AddFoodDetails;
