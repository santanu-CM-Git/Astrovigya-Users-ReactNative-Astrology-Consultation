// KundaliChart.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const planetRadius = 20;
const KundaliChart = () => {
  

  const planets = [
    { name: 'Sun', position: { left: 80, top: 20 } },
    { name: 'Moon', position: { left: 150, top: 70 } },
    // Add more planets and their positions as needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {planets.map((planet, index) => (
          <View key={index} style={[styles.planet, planet.position]}>
            <Text style={styles.planetText}>{planet.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: 'black',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  planet: {
    width: 2 * planetRadius,
    height: 2 * planetRadius,
    borderRadius: planetRadius,
    backgroundColor: 'yellow',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default KundaliChart;