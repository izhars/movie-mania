import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 30) / 2; // Adjust the margin and padding accordingly

const RandomUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://randomuser.me/api/?results=20');
        setUsers(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserDetailPage', { user: item })}>
      <View style={styles.item}>
        <Image source={{ uri: item.picture.medium }} style={styles.image} />
        <Text style={styles.text}>{`${item.name.first} ${item.name.last}`}</Text>
        <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>{`${item.email}`}</Text>
        <Text style={styles.text}>{`${item.phone}`}</Text>
        <View style={styles.border}>
          <Text style={styles.textdetails}>View Detail</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      numColumns={2}
      keyExtractor={(item) => item.login.uuid}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 5,
    width: ITEM_WIDTH,
    backgroundColor: '#fff', // Set background color if needed
    shadowColor: '#808080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android shadow
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  textdetails: {
    color: 'white',
    textAlign: 'center',
  },
  border: {
    padding: 5,
    marginTop: 5,
    backgroundColor: 'gray',
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RandomUserList;
