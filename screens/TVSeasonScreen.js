import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from './Loader';
import { Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-virtualized-view';
import { BEARER_TOKEN, getTVSeasonDataUrl, getTVCastDataUrl, getTVImagesDataUrl, getTVVideosDataUrl } from './config';
import TVSeriesTabContainer from './TVSeriesTabContainer';
import HeaderWithBackButton from './HeaderWithBackButton';

const TVSeasonScreen = ({ route }) => {
    const { seriesId, seasonNumber } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [posters, setPosters] = useState([]);
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    const getYear = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };

    const fetchTVSeasonData = async () => {
        try {
            const [seasonResponse, castResponse, imagesResponse, videosResponse] = await Promise.all([
                fetch(getTVSeasonDataUrl(seriesId, seasonNumber), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                }),
                fetch(getTVCastDataUrl(seriesId, seasonNumber), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                }),
                fetch(getTVImagesDataUrl(seriesId, seasonNumber), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                }),
                fetch(getTVVideosDataUrl(seriesId, seasonNumber), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                }),
            ]);

            if (!seasonResponse.ok || !castResponse.ok || !imagesResponse.ok || !videosResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const seasonData = await seasonResponse.json();
            const castData = await castResponse.json();
            const imagesData = await imagesResponse.json();
            const videosData = await videosResponse.json();

            setData(seasonData);
            setCast(castData.cast);
            setPosters(imagesData.posters);
            setVideos(videosData.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTVSeasonData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!data) {
        return <Text>No data found.</Text>;
    }

    return (
        <View style={styles.container}>
            <HeaderWithBackButton
                seasonNumber={seasonNumber} // Replace with actual season number
                airDate={data.air_date} // Replace with actual air date
                episodeCount={data.episodes.length} // Replace with actual episode count
            />

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.section}>
                    <Text style={styles.episodesCount}>Episodes</Text>
                    <FlatList
                        data={data.episodes}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('EpisodeDetailScreen', {
                                    tvId: seriesId,
                                    seasonNumber: seasonNumber,
                                    episodeNumber: item.episode_number
                                })}
                            >
                                <View style={styles.episodeContainer}>
                                    <View style={styles.imageContainer}>
                                        {item.still_path ? (
                                            <Image
                                                source={{ uri: `https://image.tmdb.org/t/p/w500${item.still_path}` }}
                                                style={styles.image}
                                            />
                                        ) : (
                                            <View style={[styles.image, styles.placeholderImage]}>
                                                <Text style={styles.placeholderText}>No Image Available</Text>
                                            </View>
                                        )}
                                        <View style={styles.textContainer}>
                                            <Text style={styles.episodeTitle}>{item.episode_number}. {item.name}</Text>
                                            <Text style={styles.episodeOverview} ellipsizeMode='tail' numberOfLines={4}>{item.overview}</Text>
                                            <Text style={styles.episodeDetails}>
                                                Air Date: {item.air_date} | Runtime: {item.runtime} min | Vote Average: {item.vote_average}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.episodesCount}>Cast</Text>
                    {cast && cast.length > 0 ? (
                        <>
                            <FlatList
                                data={cast}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => navigation.navigate('CastDetail', { personId: item.id })}>
                                        <View style={styles.castContainer}>
                                            {item.profile_path ? (
                                                <Image
                                                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }}
                                                    style={styles.castImage}
                                                />
                                            ) : (
                                                <View style={[styles.castImage, styles.placeholderImage]}>
                                                    <Text>No Image Available</Text>
                                                </View>
                                            )}
                                            <Text style={styles.castName}>{item.name}</Text>
                                            <Text style={styles.castCharacter}>{item.character}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.buttonSeason}
                                onPress={() => navigation.navigate('TVSeasonCast', { seriesId: seriesId, season_no: seasonNumber })}
                            >
                                <Text style={styles.buttonText}>Full Cast & Crew</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text>No cast information available.</Text>
                    )}
                </View>
                <TVSeriesTabContainer videos={videos} posters={posters} loading={loading} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    section: {
        padding: 10,
        backgroundColor: "#F0F3F8",
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    titleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        position: 'absolute',
        marginStart: 10
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
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        alignSelf: 'center',
    },
    episodesCount: {
        fontSize: 18,
        marginBottom: 16,
        fontFamily: "Roboto-Medium",
        color:'black'
    },
    placeholderText: {
        color: 'gray',
        fontSize: 16,
      },
    subtitle: {
        fontSize: 18,
        marginBottom: 16,
        alignSelf: 'center',
    },
    episodeContainer: {
        borderRadius: 10,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 150,
        marginRight: 16,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
    },
    episodeTitle: {
        fontSize: 18,
        fontFamily: 'Roboto-Medium',
        color:'black'
    },
    episodeOverview: {
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Roboto-Regular',
        color:'gray'
    },
    episodeDetails: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Roboto-Italic',
    },
    castContainer: {
        marginRight: 16,
        width: 100
    },
    castImage: {
        width: 100,
        height: 140,
        borderRadius: 10,
    },
    castName: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        marginTop: 8,
        color:'black'
    },
    castCharacter: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Roboto-Italic',
    },
    buttonSeason: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#E0E0E5',
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: 'bold',
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vidContainer: {
        flex: 1,
        padding: 5,
        backgroundColor: '#F0F3F8',
    },
    videoTitle: {
        fontFamily: 'Roboto-Bold',
        padding: 10,
        backgroundColor: '#F0F3F8'
    },
});

export default TVSeasonScreen;
