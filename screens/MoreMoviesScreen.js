import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BEARER_TOKEN } from './config';
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';

const MoreMoviesScreen = () => {
    const route = useRoute();
    const { query, type } = route.params; 
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const navigation = useNavigation();

    const fetchMovies = async (query, page) => {
        let url;
        switch (type) {
            case 'movie':
                url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
                break;
            case 'tvShow':
                url = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}`;
                break;
            case 'collection':
                url = `https://api.themoviedb.org/3/search/collection?query=${query}&include_adult=false&language=en-US&page=${page}`;
                break;
            case 'company':
                url = `https://api.themoviedb.org/3/search/company?query=${query}&include_adult=false&language=en-US&page=${page}`;
                break;
            default:
                url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
        }

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    };

    const loadMoreMovies = async () => {
        if (!isLoading && hasMore) {
            setIsLoading(true);
            try {
                const data = await fetchMovies(query, page);
                if (data.results.length > 0) {
                    setMovies((prevMovies) => [...prevMovies, ...data.results]);
                    setPage((prevPage) => prevPage + 1); 
                } else {
                    setHasMore(false); 
                }
                setIsLoading(false);
            } catch (error) {
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchMovies(query, page);
                setMovies(data.results);
                setPage((prevPage) => prevPage + 1); 
                setHasMore(data.results.length > 0); 
                setIsLoading(false);
            } catch (error) {
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [query]);

    const handleItemPress = (item) => {
        switch (type) {
            case 'movie':
                navigation.navigate('MovieDetail', { movieId: item.id });
                break;
            case 'tvShow':
                navigation.navigate('TvDetailScreen', { id: item.id });
                break;
            case 'collection':
                navigation.navigate('CollectionScreen', { collectionId: item.id });
                break;
            case 'company':
                navigation.navigate('CompanyScreen', { companyId: item.id });
                break;
            default:
                navigation.navigate('MovieDetailScreen', { movieId: item.id });
        }
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
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Results for "{query}" {type}</Text>
            <FlatList
                data={movies}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.movieItem}
                        onPress={() => handleItemPress(item)}>
                        <View style={styles.imageContainer}>
                            {item.poster_path || item.logo_path ? (
                                <Image
                                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
                                    style={styles.poster}
                                    resizeMode={item.poster_path ? 'cover' : 'contain'}
                                />
                            ) : (
                                <View style={[styles.poster, styles.placeholder]}>
                                    <Text>No Image Available</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} ellipsizeMode='tail' numberOfLines={2}>{item.title || item.name || item.original_name}</Text>
                            <Text style={styles.releaseDate}>{item.release_date || item.first_air_date || ''}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.grid}
                onEndReached={loadMoreMovies} 
                onEndReachedThreshold={0.5} 
                ListFooterComponent={isLoading ? <ActivityIndicator size="small" color="red" /> : null} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    movieItem: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    poster: {
        width: "100%",
        height: 170,
    },
    details: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    releaseDate: {
        color: 'gray',
    },
    grid: {
        justifyContent: 'space-between',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MoreMoviesScreen;
