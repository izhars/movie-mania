import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const UpcomingMovieItem = ({ item, onPress }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const votePercentage = Math.ceil(item.vote_average * 10);
  const strokeDashoffset = 100 - (votePercentage * 113) / 100;

  const getVoteColor = (votePercentage) => {
    if (votePercentage >= 70) {
      return '#5cb85c'; // green
    } else if (votePercentage >= 50) {
      return '#f0ad4e'; // yellow
    } else {
      return '#d9534f'; // red
    }
  };


  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieDetails}>
        <View style={styles.voteContainer}>
          <Svg height="40" width="40" viewBox="0 0 40 40">
            <Circle
              cx="20"
              cy="20"
              r="18"
              stroke="#e0e0e0"
              strokeWidth="4"
              fill="none"
            />
            <Circle
              cx="20"
              cy="20"
              r="18"
              stroke={getVoteColor(votePercentage)}
              strokeWidth="4"
              fill="none"
              strokeDasharray="100"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            <Circle
              cx="20"
              cy="20"
              r="16"
              fill="#000"
            />
          </Svg>
          <Text style={styles.voteText}>{votePercentage}%</Text>
        </View>
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">{item.title} </Text>
          <Text style={styles.movieReleaseDate}>{formatDate(item.release_date)}</Text>
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 180,
    height: 330,
    marginRight: 10,
  },
  movieDetails: {
    flex: 1,
    padding: 5,
    position: 'relative',
},
  poster: {
    width: '100%',
    height: 260,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  movieDetails: {
    flex: 1,
    padding: 5,
    position: 'relative',
  },
  movieTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    padding: 5,
    color: 'black'
  },
  movieReleaseDate: {
    padding: 5,
    fontSize: 12,
    fontStyle: 'Roboto-Italic',
    color: 'black'
  },
});

export default UpcomingMovieItem;
