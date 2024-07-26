import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const NutritionScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [foods, setFoods] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchNutritionDetails();
    }, [selectedDate]);

    const fetchNutritionDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/NutriTrack/www/php/getUserFoodEntries.php?date=${selectedDate}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFoods(data);
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    const goToAddFoodDetails = (category) => {
        navigation.navigate('AddFoodDetails', { date: selectedDate, category });
    };

    const viewFoodDetails = (food) => {
        navigation.navigate('FoodDetails', { foodName: food.food_name, date: selectedDate, category: food.category });
    };

    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>NutriTrack</Text>
            </View>
            
            <View style={styles.formGroup}>
                <Text style={styles.label}>Select Date:</Text>
                <TextInput
                    style={styles.dateInput}
                    value={selectedDate}
                    onChangeText={text => setSelectedDate(text)}
                />
            </View>

            {categories.map(category => {
                const categoryFoods = foods.filter(food => food.category === category);
                const totalKcal = categoryFoods.reduce((sum, food) => sum + parseFloat(food.calories), 0).toFixed(2);

                return (
                    <View key={category} style={styles.categoryBox}>
                        <Text style={styles.categoryTitle}>
                            <Icon name={category === 'breakfast' ? 'sun' : category === 'lunch' ? 'sun' : category === 'dinner' ? 'moon' : 'apple-alt'} size={32} color="#555" />
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                        <Text style={styles.totalKcal}>Total kcal: {totalKcal}</Text>
                        <Button title="+" onPress={() => goToAddFoodDetails(category)} />
                        <FlatList
                            data={categoryFoods}
                            keyExtractor={item => item.food_name}
                            renderItem={({ item }) => (
                                <View style={styles.foodItem}>
                                    <Text style={styles.foodText}>{item.food_name} - {item.calories} kcal</Text>
                                    <TouchableOpacity onPress={() => viewFoodDetails(item)}>
                                        <Image source={require('./img/three-horizontal-dots-icon.png')} style={styles.viewDetails} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                );
            })}

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerIcon}>
                    <Icon name="home" size={30} color="white" />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Nutrition')} style={styles.footerIcon}>
                    <Icon name="apple" size={30} color="white" />
                    <Text style={styles.footerText}>Nutrition</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Report')} style={styles.footerIcon}>
                    <Icon name="file-alt" size={30} color="white" />
                    <Text style={styles.footerText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.footerIcon}>
                    <Icon name="user" size={30} color="white" />
                    <Text style={styles.footerText}>Profile</Text>
                </TouchableOpacity>
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
    header: {
        backgroundColor: '#4CAF50',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
    },
    dateInput: {
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        textAlign: 'center',
    },
    categoryBox: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        position: 'relative',
    },
    categoryTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    totalKcal: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    foodItem: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewDetails: {
        width: 24,
        height: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#4CAF50',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    footerIcon: {
        alignItems: 'center',
    },
    footerText: {
        color: 'white',
    },
});

export default NutritionScreen;
