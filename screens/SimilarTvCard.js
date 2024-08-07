import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import RatingCircle from './RatingCircle'; // Import the RatingCircle component

const SimilarTvCard = ({ tvShow, onPress }) => {

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
            <View style={styles.card}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500/${tvShow.poster_path}` }}
                    style={styles.poster}
                    resizeMode="cover"
                />
                <View style={styles.tvDetails}>
                    <View style={styles.voteContainer}>
                        <RatingCircle rating={tvShow.vote_average.toFixed(1)} />
                    </View>
                    <Text style={styles.tvTitle} numberOfLines={1} ellipsizeMode="tail">
                        {tvShow.title || tvShow.name}
                    </Text>
                    <Text style={styles.tvReleaseDate}>
                        {tvShow.release_date ? formatDate(tvShow.first_air_date) : formatDate(tvShow.first_air_date)}
                    </Text>
                </View>
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
    tvDetails: {
        flex: 1,
        padding: 5,
        position: 'relative',
    },
    tvTitle: {
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
    tvReleaseDate: {
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

export default SimilarTvCard;
