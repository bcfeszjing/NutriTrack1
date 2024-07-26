import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function FoodDetailsScreen({ navigation, route }) {
  const [foodDetails, setFoodDetails] = useState({
    foodName: '',
    servingSize: '',
    calories: '',
    protein: '',
    fat: '',
    fiber: '',
    sugar: '',
    carbs: '',
  });

  useEffect(() => {
    const { foodName, date, category } = route.params || {};
    if (foodName && date && category) {
      fetchFoodDetails(foodName, date, category);
    }
  }, []);

  const fetchFoodDetails = (foodName, date, category) => {
    const userId = sessionStorage.getItem('userId'); // Assuming user ID is stored in sessionStorage

    fetch(`/NutriTrack/www/php/getFoodDetails.php?user_id=${userId}&food_name=${foodName}&date=${date}&category=${category}`)
      .then(response => response.json())
      .then(foodDetails => {
        if (foodDetails) {
          setFoodDetails({
            foodName: foodDetails.food_name,
            servingSize: foodDetails.serving_size.toString(),
            calories: foodDetails.calories.toFixed(2),
            protein: foodDetails.protein.toFixed(2),
            fat: foodDetails.fat.toFixed(2),
            fiber: foodDetails.fiber.toFixed(2),
            sugar: foodDetails.sugar.toFixed(2),
            carbs: foodDetails.carbs.toFixed(2),
          });
        } else {
          console.error('Food details not found');
        }
      })
      .catch(error => console.error('Error fetching food details:', error));
  };

  const fetchFoodDetailsFromAPI = () => {
    const query = `${foodDetails.servingSize}g ${foodDetails.foodName}`;
    const apiKey = 'C88S0O73Y7LOimgVjnnAiA==BddFHkUwNFO1u7hd';
    const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${query}`;

    fetch(apiUrl, {
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const details = data.items[0];
          setFoodDetails({
            ...foodDetails,
            calories: details.calories.toFixed(2),
            protein: details.protein_g.toFixed(2),
            fat: details.fat_total_g.toFixed(2),
            fiber: details.fiber_g.toFixed(2),
            sugar: details.sugar_g.toFixed(2),
            carbs: details.carbohydrates_total_g.toFixed(2),
          });
        } else {
          console.error('No food details found');
        }
      })
      .catch(error => console.error('Error fetching food details:', error));
  };

  const saveEditedFood = () => {
    const params = route.params;
    const updatedFoodDetails = {
      ...foodDetails,
      date: params.date,
      category: params.category,
    };

    fetch('/NutriTrack/www/php/updateFoodDetails.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFoodDetails),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Alert.alert('Success', 'Food details updated successfully!');
          navigation.navigate('Nutrition');
        } else {
          console.error('Failed to update food details:', data.error);
          Alert.alert('Error', 'Failed to update food details.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred while updating food details.');
      });
  };

  const deleteFood = () => {
    const params = route.params;
    const foodDetailsToDelete = {
      food_name: foodDetails.foodName,
      date: params.date,
      category: params.category,
    };

    fetch('/NutriTrack/www/php/deleteFoodDetails.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodDetailsToDelete),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Alert.alert('Success', 'Food deleted successfully!');
          navigation.navigate('Nutrition');
        } else {
          console.error('Error deleting food:', data.error);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Details</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Food Name:</Text>
        <TextInput
          style={styles.input}
          value={foodDetails.foodName}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, foodName: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Serving Size (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.servingSize}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, servingSize: text })}
        />
        <Button title="Search" onPress={fetchFoodDetailsFromAPI} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Calories:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.calories}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, calories: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Protein (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.protein}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, protein: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Total Fat (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.fat}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, fat: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Fiber (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.fiber}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, fiber: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sugar (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.sugar}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, sugar: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Total Carbohydrates (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={foodDetails.carbs}
          onChangeText={(text) => setFoodDetails({ ...foodDetails, carbs: text })}
        />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Save" onPress={saveEditedFood} />
        <Button title="Delete" onPress={deleteFood} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: '#555',
  },
  input: {
    width: '100%',
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
});
