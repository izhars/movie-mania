import { StyleSheet, Text, View, Image, FlatList, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { BEARER_TOKEN, getCollectionUrl } from './config';
import Icon from 'react-native-vector-icons/Ionicons';
import RatingCircle from './RatingCircle';
import Loader from './Loader';
import TabContainerWithBd from './TabContainerWithBd';

const { width } = Dimensions.get('window');

const CollectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { collectionId } = route.params;
  const [collection, setCollection] = useState(null);
  const [poster, setPoster] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(getCollectionUrl(collectionId), {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.status_message);
        }

        const data = await response.json();
        setCollection(data);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setError(error.message || 'An error occurred while fetching the collection.');
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/collection/${collectionId}/images`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.status_message);
        }

        const data = await response.json();
        setPoster(data.posters);
        setBackdrops(data.backdrops);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchCollection();
    fetchImages();
  }, [collectionId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date N/A';
    }
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backdropContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w1280${collection.backdrop_path}` }}
          style={styles.backdropImage}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w780${collection.poster_path}` }}
          style={styles.posterImage}
        />
      </View>
      <Text style={styles.title}>{collection.name}</Text>
      <Text style={styles.overview}>{collection.overview}</Text>
      <FlatList
        data={collection.parts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieContainer}
            onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
          >
            {item.poster_path ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w780${item.poster_path}` }}
                style={styles.movieImage}
              />
            ) : (
              <View style={[styles.movieImage, styles.placeholder]}>
                <Text>No Image Available</Text>
              </View>
            )}

            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>
                <RatingCircle rating={item.vote_average.toFixed(1)} />
                <Text style={styles.releaseDate}>{formatDate(item.release_date)}</Text>
              </View>
              <Text style={styles.movieOverview} ellipsizeMode="tail" numberOfLines={4}>
                {item.overview}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
      {backdrops.length > 0 && (
        <View>
          <TabContainerWithBd videos={""} posters={poster} backdrops={backdrops} loading={""} />
        </View>
      )}
    </ScrollView>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  backdropContainer: {
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: 220,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  posterContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  posterImage: {
    width: 150,
    height: 225,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  overview: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#555',
    textAlign: 'justify',
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 2,
  },
  movieImage: {
    width: width * 0.3,
    height: 200,
    borderRadius: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  movieDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  releaseDate: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    marginStart: 10,
  },
  movieOverview: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto-Regular',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  imageList: {
    marginVertical: 20,
  },
  imageItem: {
    width: 150,
    height: 225,
    borderRadius: 10,
    margin: 10
  },
});
