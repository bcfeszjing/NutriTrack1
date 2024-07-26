import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [username, setUsername] = useState('Loading...');
  const [caloriesIntake, setCaloriesIntake] = useState('Loading...');
  const [meals, setMeals] = useState([{ id: '1', name: 'Loading...' }]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsername();
    displayTodayMeals();
    calculateTodayCalories();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await fetch('/NutriTrack/www/php/getUserData.php');
      const data = await response.json();
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const displayTodayMeals = async () => {
    try {
      const response = await fetch('/NutriTrack/www/php/getTodayMeals.php');
      const savedFoods = await response.json();
      if (savedFoods.length === 0) {
        setMeals([{ id: '1', name: 'No meals for today' }]);
      } else {
        setMeals(savedFoods.map((meal, index) => ({
          id: index.toString(),
          name: `${meal.food_name} (${meal.serving_size}g) - ${meal.calories} calories`,
        })));
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const calculateTodayCalories = async () => {
    try {
      const response = await fetch('/NutriTrack/www/php/getTodayMeals.php');
      const savedFoods = await response.json();
      let totalCalories = 0;
      savedFoods.forEach(meal => {
        totalCalories += parseFloat(meal.calories);
      });
      setCaloriesIntake(`${totalCalories.toFixed(1)} kcal`);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NutriTrack</Text>
        <Text style={styles.headerGreeting}>Welcome, {username}</Text>
      </View>
      <View style={styles.infoSection}>
        <View style={styles.infoBar}>
          <Text style={styles.infoTitle}>Today's Calories Intake</Text>
          <Text style={styles.infoText}>{caloriesIntake}</Text>
        </View>
        <View style={styles.mealsList}>
          <Text style={styles.infoTitle}>Today's Meals</Text>
          <FlatList
            data={meals}
            renderItem={({ item }) => (
              <Text style={styles.mealItem}>{item.name}</Text>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      <View style={styles.space}></View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerIcon}>
          <HomeIcon />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Nutrition')} style={styles.footerIcon}>
          <NutritionIcon />
          <Text style={styles.footerText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Report')} style={styles.footerIcon}>
          <ReportIcon />
          <Text style={styles.footerText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.footerIcon}>
          <ProfileIcon />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const NutritionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.56 5.13 4 6.32V20H7v2h10v-2h-2v-4.68c2.44-1.19 4-3.58 4-6.32 0-3.87-3.13-7-7-7zM11 18h2v2h-2v-2zm1-5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
    <path d="M13 9h5v7h-5zM4 11h5v5H4z" opacity=".3" />
    <path d="M20 5h-3V3H7v2H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM4 20V7h16v13H4z" />
    <path d="M4 11h5v5H4zm9-2h5v7h-5z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#007BFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    color: '#FFF',
    fontSize: 18,
  },
  headerGreeting: {
    color: '#FFF',
    fontSize: 14,
  },
  infoSection: {
    flex: 1,
    padding: 20,
  },
  infoBar: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
  },
  mealsList: {
    flex: 1,
  },
  mealItem: {
    fontSize: 14,
    marginBottom: 10,
  },
  space: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerIcon: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
  },
  footerText: {
    color: '#fff',
    marginTop: 3,
  },
});

export default Home;
