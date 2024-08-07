import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getViewAllSeasons, BEARER_TOKEN } from './config';
import { Title } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';
import HeaderWithBackButton from './HeaderWithBackButton';

const ViewAllSeasons = ({ route }) => {
    const { tvId } = route.params;
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seriesName, setName] = useState('');
    const [series_id, setSeries] = useState('');
    const navigation = useNavigation();

    const formatPublishedDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            return date.toLocaleDateString('en-IN', options).replace(' ', ', ');
        }
        return '';
    };

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(getViewAllSeasons(tvId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                    },
                });
                const data = await response.json();
                if (data.seasons) {
                    setSeasons(data.seasons);
                    setName(data.original_name);
                    setSeries(data.id);
                } else {
                    setSeasons([]);
                }
            } catch (error) {
                setError('Error fetching seasons');
                console.error('Error fetching seasons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeasons();
    }, [tvId]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderSeason = ({ item: season }) => {
        const { id, poster_path, air_date, episode_count } = season;

        const handleSeasonPress = () => {
            navigation.navigate('TVSeasonScreen', { seriesId: series_id, seasonNumber: season.season_number });
        };

        return (
            <TouchableOpacity onPress={handleSeasonPress}>
                <View key={id} style={styles.seasonContainer}>
                    {poster_path ? (
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
                            style={styles.poster}
                        />
                    ) : (
                        <View style={[styles.poster, styles.placeholder]}>
                            <Text>No Image Available</Text>
                        </View>
                    )}
                    <View style={styles.info}>
                        <Text style={styles.title}>{seriesName}</Text>
                        <Text style={styles.subtitle}>
                            {air_date ? new Date(air_date).getFullYear() : 'Unknown Year'} · {episode_count} Episodes
                        </Text>
                        {air_date && (
                            <Text style={styles.premiereDate}>
                                {`Season ${season.season_number} of ${seriesName} premiered on ${formatPublishedDate(air_date)}.`}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <View style={styles.loadingContainer}>
            <Loader />
        </View>
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <HeaderWithBackButton title={seriesName} />
            <FlatList
                data={seasons}
                renderItem={renderSeason}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text>No seasons available</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56, // standard header height
        paddingHorizontal: 16,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    titleHeader: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
    },
    seasonContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    info: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    premiereDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        fontFamily: 'Roboto-Regular',
    },
    list: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ViewAllSeasons;
