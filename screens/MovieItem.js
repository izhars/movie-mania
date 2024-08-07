import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';


const DEFAULT_POSTER = 'URL_TO_DEFAULT_POSTER_IMAGE';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const getGradientStops = (votePercentage) => {
    if (votePercentage >= 70) {
        return ['#5cb85c', '#bee3be'];
    } else if (votePercentage >= 50) {
        return ['#f0ad4e', '#f9deb8'];
    } else {
        return ['#d9534f', '#f0bab9'];
    }
};

const MovieItem = ({ item, onPress }) => {
    
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (item.vote_average / 10) * circumference;
    const [startColor, endColor] = getGradientStops(item.vote_average * 10);

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item.id)}>
            <Image
                source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : DEFAULT_POSTER }}
                style={styles.poster}
                resizeMode="cover"
            />
            <View style={styles.movieDetails}>
                <View style={styles.voteContainer}>
                    <Svg height="50" width="50" viewBox="0 0 80 80">
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor={startColor} stopOpacity="1" />
                                <Stop offset="100%" stopColor={endColor} stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="white"
                            strokeWidth="14"
                            fill="#000"
                        />
                        <Circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="url(#grad)"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                        <SvgText
                            x="40"
                            y="40"
                            textAnchor="middle"
                            dy="0.3em"
                            fontSize="18"
                            fill="#fff"
                        >
                            {item.vote_average.toFixed(1)}
                        </SvgText>
                    </Svg>
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
        marginTop: 7,
        color: 'black',
    },
    movieReleaseDate: {
        padding: 5,
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
});

export default MovieItem;
