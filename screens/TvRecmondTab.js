import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, StyleSheet, Image } from 'react-native';
import Loader from './Loader';
import RatingCircle from './RatingCircle';
import RatingCircleSmall from './RatingCircleSmall';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const TvRecmondTab = ({ recommended, similarSeries, loading, navigation }) => {
    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        if (recommended && recommended.length > 0) {
            setSelectedTab('Recommendations');
        } else if (similarSeries && similarSeries.length > 0) {
            setSelectedTab('Similar TV Series');
        }
    }, [recommended, similarSeries]);

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

    const renderTvShowItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('TvDetailScreen', { id: item.id })} style={styles.card}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                style={styles.image}
                resizeMode='cover'
            />
            <View style={styles.tvDetails}>
                <View style={styles.voteContainer}>
                    <RatingCircleSmall rating={item.vote_average.toFixed(1)} />
                </View>
                <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{item.name}</Text>
                <Text style={styles.release_date}>{formatDate(item.first_air_date)}</Text>
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
                {similarSeries && similarSeries.length > 0 && (
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'Similar TV Series' && styles.selectedTabButton]}
                        onPress={() => handleTab('Similar TV Series')}
                    >
                        <Text style={styles.tabText}>Similar TV Series</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.container}>
                {selectedTab === 'Recommendations' && recommended && recommended.length > 0 && (
                    <View style={styles.vidContainer}>
                        <FlatList
                            data={recommended}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderTvShowItem}
                        />
                    </View>
                )}

                {selectedTab === 'Similar TV Series' && similarSeries && similarSeries.length > 0 && (
                    <View style={styles.vidContainer}>
                        <FlatList
                            data={similarSeries}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderTvShowItem}
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
    title: {
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
});

export default TvRecmondTab;
