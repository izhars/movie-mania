import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, StyleSheet, Image } from 'react-native';
import Loader from './Loader';
import RatingCircleSmall from './RatingCircleSmall';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MovieRecmondTab = ({ recommended, similarMovies, loading, navigation }) => {
    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        if (recommended && recommended.length > 0) {
            setSelectedTab('Recommendations');
        } else if (similarMovies && similarMovies.length > 0) {
            setSelectedTab('Similar Movies');
        }
    }, [recommended, similarMovies]);

    const handleTab = (tab) => {
        const customAnimation = {
            duration: 300,
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        };

        LayoutAnimation.configureNext(customAnimation);
        setSelectedTab(tab);
    };

    if (loading) {
        return <Loader />;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })} style={styles.card}>
            {item.poster_path ? (
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.image}
                />
            ) : (
                <View style={[styles.image, styles.placeholder]}>
                    <Text>No Image Available</Text>
                </View>
            )}
            <View style={styles.tvDetails}>
                <View style={styles.voteContainer}>
                    <RatingCircleSmall rating={item.vote_average.toFixed(1)} />
                </View>
                <Text style={styles.tvTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                </Text>
                <Text style={styles.release_date}>
                    {formatDate(item.release_date)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.section}>
            <View style={styles.tabContainer}>
                {recommended && recommended.length > 0 && (
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'Recommendations' && styles.selectedTabButton]}
                        onPress={() => handleTab('Recommendations')}
                    >
                        <Text style={styles.tabText}>Recommendations</Text>
                    </TouchableOpacity>
                )}
                {similarMovies && similarMovies.length > 0 && (
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'Similar Movies' && styles.selectedTabButton]}
                        onPress={() => handleTab('Similar Movies')}
                    >
                        <Text style={styles.tabText}>Similar Movies</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.container}>
                {selectedTab === 'Recommendations' && recommended && recommended.length > 0 && (
                    <View style={styles.vidContainer}>
                        <FlatList
                            data={recommended}
                            keyExtractor={(item, index) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderMovieItem}
                        />
                    </View>
                )}

                {selectedTab === 'Similar Movies' && similarMovies && similarMovies.length > 0 && (
                    <View style={styles.vidContainer}>
                        <FlatList
                            data={similarMovies}
                            keyExtractor={(item, index) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderMovieItem}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: "#F0F3F8",
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    selectedTabButton: {
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 16,
        color: '#007AFF',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    vidContainer: {
        flex: 1,
        padding: 5,
        backgroundColor: '#F0F3F8',
    },
    card: {
        margin: 10,
        width: 100,
    },
    image: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    tvTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        padding: 5,
        marginTop: 10,
        color: "black"
    },
    release_date: {
        padding: 5,
        fontSize: 12,
        fontStyle: 'Roboto-Italic',
        color: "black"
    },
    voteContainer: {
        position: 'absolute',
        top: -20,
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

export default MovieRecmondTab;
