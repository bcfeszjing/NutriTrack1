// ReportScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { fetchRDI, fetchData } from './api'; // Implement API calls in a separate file

const screenWidth = Dimensions.get('window').width;

const ReportScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('thisWeek');
  const [rdi, setRDI] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData(period);
        setData(fetchedData);
        const rdiValue = await fetchRDI();
        setRDI(rdiValue);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period]);

  const renderChart = () => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    
    // Sample chart data
    const chartData = {
      labels: data.map(item => item.category),
      datasets: [{
        data: data.map(item => item.calories),
      }],
    };

    return period === 'today' || period === 'yesterday' ? (
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="calories"
        backgroundColor="transparent"
      />
    ) : (
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        fromZero={true}
        showBarTops={false}
      />
    );
  };

  const renderFoodSummary = () => {
    const foodMap = new Map();
    data.forEach(item => {
      if (foodMap.has(item.food_name)) {
        let foodDetails = foodMap.get(item.food_name);
        foodDetails.timesEaten++;
        foodDetails.totalCalories += item.calories;
      } else {
        foodMap.set(item.food_name, {
          timesEaten: 1,
          totalCalories: item.calories
        });
      }
    });

    return (
      <FlatList
        data={Array.from(foodMap.entries()).map(([foodName, details]) => ({ foodName, ...details }))}
        keyExtractor={(item) => item.foodName}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.foodName}</Text>
            <Text style={styles.cell}>{item.timesEaten}</Text>
            <Text style={styles.cell}>{item.totalCalories.toFixed(2)} kcal</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Report</Text>
      </View>

      <TouchableOpacity style={styles.goal} onPress={() => navigation.navigate('Goal')}>
        <Text style={styles.goalText}>Goal 🎯</Text>
        <Text style={styles.rdiValue}>{rdi ? `${rdi} kcal` : 'Loading...'}</Text>
      </TouchableOpacity>

      <View style={styles.navigator}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => {/* Toggle dropdown */}}>
          <Text style={styles.dropdownText}>{period}</Text>
        </TouchableOpacity>
        {/* Add dropdown options */}
      </View>

      {renderChart()}

      <View style={styles.foodSummary}>
        <Text style={styles.summaryTitle}>Foods Eaten</Text>
        {renderFoodSummary()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Nutrition')}>
          <Text>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Report')}>
          <Text>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
  },
  goal: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#94f081',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  goalText: {
    fontSize: 18,
    color: '#333',
  },
  rdiValue: {
    fontSize: 14,
    color: '#007bff',
  },
  navigator: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dropdownButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  foodSummary: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'left',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#4CAF50',
  },
});

export default ReportScreen;
