import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { getPopularPersonUrl, BEARER_TOKEN } from './config';
import Loader from './Loader';
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

  const renderItem = ({ item }) => (
    <Card style={styles.movieCard}>
      <TouchableOpacity onPress={() => navigation.navigate('CastDetail', { personId: item.id })}>
        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }} style={styles.poster} />
        <Card.Content>
          <Title style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</Title>
          <Paragraph style={styles.knownFor}>Known for: {item.known_for_department}</Paragraph>
        </Card.Content>
      </TouchableOpacity>
    </Card>
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
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  movieCard: {
    margin: 5,
    flex: 1,
    maxWidth: '100%',
  },
  poster: {
    height: 250,
    resizeMode: 'cover',
    padding: 5,
  },
  knownFor: {
    paddingBottom: 10,
  },
});
