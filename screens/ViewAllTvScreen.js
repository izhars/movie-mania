import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from './Loader';
import { BEARER_TOKEN, getAirOnToday, getOnTheAir, getPopularTvShow, getTopRatedTvShow, getTrendingTvUrl } from './config';
import RatingCircle from './RatingCircle';
import HeaderWithBackButton from './HeaderWithBackButton';

const ViewAllTvScreen = () => {
    const route = useRoute();
    const { endpoint, selectedIndex } = route.params;
    console.log("index is:", selectedIndex)
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
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
        if (endpoint) {
            fetchData(endpoint, page);
        } else {
            console.error('Endpoint is undefined');
        }
    }, [endpoint, page]);

    const fetchData = useCallback(async (endpoint, page) => {
        setLoading(true);
        try {
            let apiUrl = '';
            switch (endpoint) {
                case 'Airing Today':
                    apiUrl = getAirOnToday(page);
                    break;
                case 'On The Air':
                    apiUrl = getOnTheAir(page);
                    break;
                case 'Popular TV Shows':
                    apiUrl = getPopularTvShow(page);
                    break;
                case 'Top Rated TV Shows':
                    apiUrl = getTopRatedTvShow(page);
                    break;
                case 'trending':
                    apiUrl = getTrendingTvUrl(page);
                    break;
                default:
                    console.error('Invalid endpoint:', endpoint);
                    return;
            }

            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });

            const result = await response.json();
            if (result.results) {
                setData((prevData) => [...prevData, ...result.results]);
                setError(null);
            } else {
                console.error('No results found in the response:', result);
                setError('No results found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
        }
        setLoading(false);
        setInitialLoading(false);
    }, []);

    const renderFooter = () => {
        return loading ? <ActivityIndicator size="small" color="red" /> : null;
    };

    const loadMore = useCallback(() => {
        setPage((prevPage) => prevPage + 1);
    }, []);

    const renderItem = ({ item }) => (


        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TvDetailScreen', { id: item.id })}
        >
            <Card.Cover
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

    return (
        <View style={styles.container}>
            <HeaderWithBackButton title={endpoint} />
            {initialLoading ? (
                <Loader />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : data.length === 0 ? (
                <Text style={styles.placeholderText}>No TV shows available</Text>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={2}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    columnWrapperStyle={styles.row}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15
    },
    backButton: {
        position: 'absolute',
        marginStart: 5
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleContainer: {
        flex: 2,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Roboto-Medium',
        alignSelf: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    endpoint: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff', // Set background color if needed
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Android shadow
        flex: 1,
        margin: 5,
        maxWidth: '50%',
    },
    poster: {
        height: 260, // Adjust height as needed to prevent image cutting
        resizeMode: 'cover', // Ensure the image covers the entire area
        padding: 5
    },
    movieDetails: {
        flex: 1,
        paddingStart: 10,
        paddingBottom: 5,
        position: 'relative',
    },
    movieTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        padding: 5,
        marginTop: 15,
    },
    movieReleaseDate: {
        padding: 5,
        fontSize: 12,
        fontStyle: 'Roboto-Italic',
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
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});

export default ViewAllTvScreen;
