import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getPopularPersonUrl, BEARER_TOKEN } from './config';
import Loader from './Loader';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const PersonScreen = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPopularPersons();
  }, [page]);

  const fetchPopularPersons = async () => {
    setLoading(true);
    try {
      const response = await fetch(getPopularPersonUrl(page), {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPersons((prevPersons) => [...prevPersons, ...data.results]);
    } catch (error) {
      console.error('Error fetching popular persons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const formatKnownForTitles = (knownFor) => {
    return knownFor.map((item) => item.title).join(', ');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.personContainer}
      onPress={() => navigation.navigate('CastDetail', { personId: item.id })}
    >
      <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }} style={styles.poster} />

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.knownFor}>
          Known for: {formatKnownForTitles(item.known_for)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && persons.length === 0) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={persons}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loading && persons.length !== 0 ? (
            <ActivityIndicator size="small" color="red" />
          ) : null
        }
      />
    </View>
  );
};

export default PersonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  personContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
    flex: 1,
    margin: 5,
    maxWidth: '50%',
  },
  poster: {
    height: 260, // Adjust height as needed to prevent image cutting
    resizeMode: 'cover', // Ensure the image covers the entire area
    padding: 5
  },
  textContainer: {
    padding: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  knownFor: {
    paddingTop: 5,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color:'#4d4d4d'
  },
});
