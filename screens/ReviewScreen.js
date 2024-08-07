import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderWithBackButton from './HeaderWithBackButton';
import Loader from './Loader';

const ReviewScreen = ({ route }) => {
  const { movieId, tvShowId, title, type } = route.params;
  console.log("ebugdfwt", movieId, tvShowId, title, type)
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const url = type === 'movie'
        ? `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`
        : `https://api.themoviedb.org/3/tv/${tvShowId}/reviews?language=en-US&page=1`;

      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2U0YjcwMTVlOGEwOTNhNjZjNWRkM2Y0MWY2MzNhNCIsIm5iZiI6MTcyMTQ1NDkwNS45Mjk0ODYsInN1YiI6IjY0Yjc2ZjBiZjI2M2JhMDEzOWYzZmQ2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ev44fUclgo4y7YqZRlnCspakUspgIr-T9P2IjMwNV5k',
          accept: 'application/json'
        }
      });
      const data = await response.json();
      console.log("bsbwdysd", data.results)
      setReviews(data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderReview = ({ item }) => (
    <View style={styles.section}>
      <View style={styles.reviewContainer}>
        <View style={styles.iconContainer}>
          {item.author_details.avatar_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.author_details.avatar_path}` }}
              style={styles.profileImage}
            />
          ) : (
            <Icon name="account-circle" size={50} color="#135796" />
          )}
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.reviewTitle} color="red">A review by </Text>
            <Text style={styles.text}>{item.author}</Text>
          </View>
          <Text style={styles.subtitle}>Written by {item.author} on {new Date(item.created_at).toLocaleDateString()}</Text>
          {item.author_details.rating && <Text style={styles.ratingText}>Rating: {item.author_details.rating}/10</Text>}
          <Text style={styles.reviewText}>{item.content}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     <HeaderWithBackButton title={title} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  section: {
    padding: 10,
    backgroundColor: "#F0F3F8",
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  iconContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto-Medium'
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto-Italic',
    paddingVertical: 10
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between'
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
});
