import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import the icon component
import Loader from './Loader';
import RatingCircle from './RatingCircle';
import HeaderWithBackButton from './HeaderWithBackButton';

function ViewAllMovieScreen({ route }) {
    const { apiType } = route.params;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
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


    useEffect(() => {
        fetchData(page);
    }, [apiType, page]);

    const fetchData = async (page) => {
        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2U0YjcwMTVlOGEwOTNhNjZjNWRkM2Y0MWY2MzNhNCIsIm5iZiI6MTcxOTM4ODYyOS43MjIwNjIsInN1YiI6IjY0Yjc2ZjBiZjI2M2JhMDEzOWYzZmQ2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0BkrHQM5ZY1GIepygYoKohjAfWx8-OLG9OBYWnUo-zQ'; // Replace with your TMDB API key
            let apiUrl;

            switch (apiType) {
                case 'trending':
                    apiUrl = `https://api.themoviedb.org/3/trending/movie/day?page=${page}`;
                    break;
                case 'upcoming':
                    apiUrl = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`;
                    break;
                case 'topRated':
                    apiUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
                    break;
                case 'now_playing':
                    apiUrl = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
                    break;
                default:
                    apiUrl = '';
            }

            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            setData(prevData => page === 1 ? result.results : [...prevData, ...result.results]);
            setIsLoading(false);
            setIsLoadingMore(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setError(error);
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const loadMoreData = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (isLoading && page === 1) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error fetching data!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderWithBackButton title={apiType.charAt(0).toUpperCase() + apiType.slice(1)} />
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
                    >
                            <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
                            <View style={styles.detailContainer}>
                                <View style={styles.voteContainer}>
                                    <RatingCircle rating={item.vote_average.toFixed(1)} />
                                </View>
                                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                                <Text style={styles.releaseYear}>
                                    {formatDate(item.release_date)}
                                </Text>
                            </View>
                        
                    </TouchableOpacity>
                )}
                numColumns={2} // Render two columns
                onEndReached={loadMoreData}
                contentContainerStyle={styles.movieList}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" color="red" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainer: {
        flex: 1,
        paddingStart: 10,
        paddingBottom: 5,
        position: 'relative',
    },
    voteContainer: {
        position: 'absolute',
        top: -30,
        right: 5,
        alignItems: 'center',
        marginEnd: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow
        flex: 1,
        margin: 5,
        maxWidth: '50%',
    },
    movieList: {
        paddingHorizontal: 5,
        paddingTop: 10,
    },
    poster: {
        height: 260, // Adjust height as needed to prevent image cutting
        resizeMode: 'cover', // Ensure the image covers the entire area
        padding: 5
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        padding: 5,
        marginTop: 10,
    },
    releaseYear: {
        padding: 5,
        fontSize: 12,
        fontStyle: 'Roboto-Italic',
    },
});

export default ViewAllMovieScreen;
