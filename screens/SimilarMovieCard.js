import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import RatingCircle from './RatingCircle'; // Import the RatingCircle component

const SimilarMovieCard = ({ movie, onPress }) => {
    const fallbackImage = 'https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png';


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image
                source={{ uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackImage }}
                style={styles.poster}
                resizeMode="cover"
            />
            <View style={styles.movieDetails}>
                <View style={styles.voteContainer}>
                    <RatingCircle rating={movie.vote_average.toFixed(1)} />
                </View>
                <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                    {movie.title || movie.name}
                </Text>
                <Text style={styles.movieReleaseDate}>
                    {movie.release_date ? formatDate(movie.release_date) : formatDate(movie.first_air_date)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginEnd: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 5,
        width: 140
    },
    movieDetails: {
        flex: 1,
        padding: 5,
        position: 'relative',
    },
    movieTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        paddingTop:5,
        marginTop: 7,
        color: 'black',
    },
    poster: {
        width: '100%',
        height: 190,
        borderRadius: 10,
    },
    movieReleaseDate: {
        fontSize: 12,
        fontStyle: 'Roboto-Italic',
        color: 'black',
    },
    voteContainer: {
        position: 'absolute',
        top: -25,
        right: 5,
        alignItems: 'center',
    },
    voteText: {
        position: 'absolute',
        top: 10,
        left: 10,
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default SimilarMovieCard;
