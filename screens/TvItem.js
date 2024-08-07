import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RatingCircle from './RatingCircle';

const TvItem = ({ item }) => {
    const navigation = useNavigation();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Handle invalid date
            return 'Invalid Date';
        }
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    const onPressHandler = () => {
        navigation.navigate('TvDetailScreen', { id: item.id });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPressHandler}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                style={styles.poster}
                resizeMode="cover"
            />
            <View style={styles.movieDetails}>
                <View style={styles.voteContainer}>
                    <RatingCircle rating={item.vote_average.toFixed(1)} />
                </View>
                <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title || item.name}
                </Text>
                <Text style={styles.movieReleaseDate}>
                    {item.release_date ? formatDate(item.release_date) : formatDate(item.first_air_date)}
                </Text>
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
        marginTop: 10,
        color: "black"
    },
    movieReleaseDate: {
        padding: 5,
        fontSize: 12,
        fontStyle: 'Roboto-Italic',
        color: "black"
    },
    voteContainer: {
        position: 'absolute',
        top: -25,
        right: 5,
        alignItems: 'center',
        marginEnd: 10,
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

export default TvItem;
