import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovieItem from './MovieItem';
import DayWeekSwitch from './DayWeekSwitch';
import Icon from 'react-native-vector-icons/Ionicons';
import { BEARER_TOKEN, getTrendingMoviesUrlByDay, getTrendingMoviesUrlByWeek, getUpcomingMoviesUrl, getTopRatedMoviesUrl, getPopularMoviesUrl, getTheatresMoviesUrl } from './config';
import CarousalData from './CarousalData';
import Loader from './Loader';

const MovieScreen = () => {
    const [dayMovies, setDayMovies] = useState([]);
    const [weekMovies, setWeekMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [theatreMovies, setTheatreMovies] = useState(null);
    const [date, setDate] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const endpoints = [
                    getTrendingMoviesUrlByDay(),
                    getTrendingMoviesUrlByWeek(),
                    getUpcomingMoviesUrl(),
                    getTopRatedMoviesUrl(),
                    getPopularMoviesUrl(),
                    getTheatresMoviesUrl(),
                ];

                const fetchPromises = endpoints.map((endpoint) =>
                    fetch(endpoint, {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${endpoint}`);
                        }
                        return response.json();
                    })
                );

                const [dayData, weekData, upcomingData, topRatedData, popularData, theatreMoviesData] = await Promise.all(fetchPromises);

                setDayMovies(dayData.results);
                setWeekMovies(weekData.results);
                setUpcomingMovies(upcomingData.results);
                setTopRatedMovies(topRatedData.results);
                setPopularMovies(popularData.results);
                setTheatreMovies(theatreMoviesData.results);
                setDate(theatreMoviesData.dates);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Data: ', error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleSwitchChange = (index) => {
        setSelectedIndex(index);
    };

    const navigateToViewAll = (apiType) => {
        navigation.navigate('DetailScreen', { apiType });
    };

    const renderMovieItem = (Component) => ({ item }) => (
        <Component
            item={item}
            onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
        />
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error}</Text>
            </View>
        );
    }

    const trendingMovies = selectedIndex === 0 ? dayMovies : weekMovies;

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>
                <Text style={styles.movie}>Movie</Text>
                <Text style={styles.flix}> Flix</Text>
            </Text>
            <ScrollView>
                <View>
                    <CarousalData popular={popularMovies} />
                    <View style={styles.switchContainerButton}>
                        <Text style={styles.header}>Trending Movies</Text>
                        <View style={styles.switchContainer}>
                            <DayWeekSwitch
                                selectedIndex={selectedIndex}
                                onSwitchChange={handleSwitchChange}
                            />
                        </View>
                        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll('trending')}>
                            <Text style={styles.viewAll}>View All</Text>
                            <Icon name="chevron-forward" size={20} color="#ff8080" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={trendingMovies}
                        renderItem={renderMovieItem(MovieItem)}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.scrollView}
                    />
                </View>
                <View style={styles.viewAllContainer}>
                    <Text style={styles.header}>In Cinemas</Text>
                    <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll('now_playing')}>
                        <Text style={styles.viewAll}>View All</Text>
                        <Icon name="chevron-forward" size={20} color="#ff8080" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal
                    data={theatreMovies}
                    renderItem={renderMovieItem(MovieItem)}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                />

                <View style={styles.viewAllContainer}>
                    <Text style={styles.header}>Upcoming Movies</Text>
                    <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll('upcoming')}>
                        <Text style={styles.viewAll}>View All</Text>
                        <Icon name="chevron-forward" size={20} color="#ff8080" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal
                    data={upcomingMovies}
                    renderItem={renderMovieItem(MovieItem)}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                />
                <View style={styles.viewAllContainer}>
                    <Text style={styles.header}>Top Rated Movies</Text>
                    <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll('topRated')}>
                        <Text style={styles.viewAll}>View All</Text>
                        <Icon name="chevron-forward" size={20} color="#ff8080" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal
                    data={topRatedMovies}
                    renderItem={renderMovieItem(MovieItem)}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainerButton: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    appName: {
        fontSize: 30,
        alignSelf: 'center',
        fontFamily: 'Roboto-Bold',
        paddingBottom: 10,
    },
    movie: {
        color: 'red',
    },
    flix: {
        color: 'black',
    },
    viewAllContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: 'black',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAll: {
        fontSize: 16,
        color: '#ff8080',
        marginRight: 5,
    },
});

export default MovieScreen;
