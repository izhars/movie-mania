import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const UserDetailPage = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Image source={{ uri: user.picture.large }} style={styles.image} />
      <Text style={styles.name}>{`${user.name.first} ${user.name.last}`}</Text>
      <Text style={styles.text}>{user.email}</Text>
      <Text style={styles.text}>{user.phone}</Text>
      <Text style={styles.text}>{`${user.location.city}, ${user.location.country}`}</Text>
      <Text style={styles.coordinates}>
        Lat: {user.location.coordinates.latitude}, Lon: {user.location.coordinates.longitude}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: '#495057',
  },
  coordinates: {
    fontSize: 16,
    marginTop: 10,
    color: '#6c757d',
  },
});

export default UserDetailPage;
