import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RandomUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://randomuser.me/api/?results=10');
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
        <Text style={styles.text}>{`${item.email}`}</Text>
        <Text style={styles.text}>{`${item.phone}`}</Text>
        <View style={styles.border}>
          <Text style={styles.textdetails}>View Detail</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      numColumns={2}
      keyExtractor={(item) => item.login.uuid}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 2,
    width: 185,
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
    backgroundColor: 'gray',
    color: 'white',
    padding: 5,
    marginTop: 5,
    textAlign: 'center',
  }
});

export default RandomUserList;
