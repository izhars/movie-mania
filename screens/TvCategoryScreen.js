import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Paragraph, List, Avatar } from 'react-native-paper';
import { BEARER_TOKEN, API_BASE_URL, getTvSeriesByCategory } from './config';
import Loader from './Loader';
import { useNavigation } from '@react-navigation/native';

const TvCategoryScreen = () => {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [tvShows, setTvShows] = useState([]);
  const [loadingTvShows, setLoadingTvShows] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (genres.length > 0) {
      setSelectedGenre(genres[0].id);
      fetchTvShowsByGenre(genres[0].id);
    }
  }, [genres]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(getTvSeriesByCategory(), {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      const data = await response.json();
      setGenres(data.genres);
      setLoadingGenres(false);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setLoadingGenres(false);
    }
  };

  const fetchTvShowsByGenre = async (genreId, reset = true) => {
    setLoadingTvShows(true);
    try {
      const pageNumber = reset ? 1 : page;
      const response = await fetch(`${API_BASE_URL}/discover/tv?with_genres=${genreId}&page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      const data = await response.json();
      if (reset) {
        setTvShows(data.results);
        setPage(2);
      } else {
        setTvShows((prevTvShows) => [...prevTvShows, ...data.results]);
        setPage((prevPage) => prevPage + 1);
      }
      setTotalPages(data.total_pages);
      setLoadingTvShows(false);
    } catch (error) {
      console.error(`Error fetching TV shows for genre ${genreId}:`, error);
      setLoadingTvShows(false);
    }
  };

  const handleLoadMore = () => {
    if (page <= totalPages && !loadingTvShows) {
      fetchTvShowsByGenre(selectedGenre, false);
    }
  };

  const renderGenreItem = ({ item }) => (
    <List.Item
      title={item.name}
      onPress={() => {
        setSelectedGenre(item.id);
        setPage(1);
        fetchTvShowsByGenre(item.id, true);
      }}
      style={[
        styles.genreItem,
        selectedGenre === item.id && styles.selectedGenre,
      ]}
      left={(props) => <List.Icon {...props} icon="label" color='red' />}
    />
  );

  const renderTvShowItem = ({ item }) => (
    <Card style={styles.tvShowCard}>
      <TouchableOpacity onPress={() => navigation.navigate('TvDetailScreen', { id: item.id })}>
        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
        <Card.Content>
          <Title style={styles.tvShowTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Title>
          <Paragraph style={styles.firstAirDate}>{formatDate(item.first_air_date)}</Paragraph>
          <Paragraph style={styles.voteAverage}>Rating: {item.vote_average}</Paragraph>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreList}
        />
      </View>
      <View style={styles.tvShowsContainer}>
        {loadingTvShows && tvShows.length === 0 ? (
          <Loader />
        ) : (
          <FlatList
            data={tvShows}
            renderItem={renderTvShowItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.tvShowList}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() =>
              loadingTvShows && tvShows.length !== 0 ? (
                <ActivityIndicator size="small" color="red" />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  genreList: {
    paddingVertical: 10,
  },
  genreItem: {
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedGenre: {
    backgroundColor: '#F8C8DC',
    borderColor: 'red',
  },
  tvShowsContainer: {
    flex: 1,
  },
  tvShowList: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  tvShowCard: {
    margin: 5,
    flex: 1,
    maxWidth: '50%',
  },
  poster: {
    height: 250,
    resizeMode: 'cover',
    padding: 5,
  },
  tvShowTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  firstAirDate: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Roboto-Italic',
  },
  voteAverage: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});

export default TvCategoryScreen;
