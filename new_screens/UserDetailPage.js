import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const UserDetailPage = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.picture.large }} style={styles.image} />
      <Text style={styles.text}>{`${user.name.first} ${user.name.last}`}</Text>
      <Text style={styles.text}>{`${user.email}`}</Text>
      <Text style={styles.text}>{`${user.phone}`}</Text>
      <Text style={styles.text}>{`${user.location.city}, ${user.location.country}`}</Text>
      <Text style={styles.text}>{`${user.location.coordinates.latitude}`}</Text>
            <Text style={styles.text}>{`${user.location.coordinates.latitude}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default UserDetailPage;
