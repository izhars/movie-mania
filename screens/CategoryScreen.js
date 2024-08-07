import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator , TouchableOpacity} from 'react-native';
import { Button, Card, Title, Paragraph, List, Avatar } from 'react-native-paper';
import { BEARER_TOKEN, getGenresUrl, getMoviesByGenreUrl } from './config';
import Loader from './Loader';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = () => {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
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
      fetchMoviesByGenre(genres[0].id);
    }
  }, [genres]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(getGenresUrl(), {
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

  const fetchMoviesByGenre = async (genreId, reset = true) => {
    setLoadingMovies(true);
    try {
      const pageNumber = reset ? 1 : page;
      const url = getMoviesByGenreUrl(genreId, pageNumber);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      const data = await response.json();
      if (reset) {
        setMovies(data.results);
        setPage(2); 
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
        setPage((prevPage) => prevPage + 1);
      }
      setTotalPages(data.total_pages);
      setLoadingMovies(false);
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      setLoadingMovies(false);
    
    }
  };

  const handleLoadMore = () => {
    if (page <= totalPages && !loadingMovies) {
      fetchMoviesByGenre(selectedGenre, false); 
    }
  };

  const renderGenreItem = ({ item }) => (
    <List.Item
      title={item.name}
      onPress={() => {
        setSelectedGenre(item.id);
        setPage(1); 
        fetchMoviesByGenre(item.id, true); 
      }}
      style={[
        styles.genreItem,
        selectedGenre === item.id && styles.selectedGenre, 
      ]}
      left={(props) => <List.Icon {...props} icon="label" color='red' />}
    />
  );

  const renderMovieItem = ({ item }) => (
    <Card style={styles.movieCard}>
      <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
      <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
      <Card.Content>
        <Title style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Title>
        <Paragraph style={styles.releaseYear}>{formatDate(item.release_date)}</Paragraph>
        <Paragraph style={styles.vote_average}>Rating: {item.vote_average}</Paragraph>
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

      <View style={styles.moviesContainer}>
        {loadingMovies && movies.length === 0 ? (
          <Loader/>
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.movieList}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore} 
            onEndReachedThreshold={0.1}
            ListFooterComponent={() =>
              loadingMovies && movies.length !== 0 ? (
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
    borderColor: 'gray'
  },
  selectedGenre: {
    backgroundColor: '#F8C8DC',
    borderColor: 'red'
  },
  moviesContainer: {
    flex: 1,
  },
  movieList: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  movieCard: {
    margin: 5,
    flex: 1,
    maxWidth: '50%',
  },
  poster: {
    height: 250, 
    resizeMode: 'cover',
    padding: 5
  },
  movieTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginTop: 10,
  },
  releaseYear: {
    marginTop: 5,
    fontSize: 12,
    fontStyle: 'Roboto-Italic',
  },
  vote_average: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});

export default CategoryScreen;
