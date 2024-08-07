import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BEARER_TOKEN, getEpisodeDetails, getEpisodeImages, getEpisodeVideos } from './config';
import RatingCircle from './RatingCircle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TVSeriesTabContainer from './TVSeriesTabContainer';
import Loader from './Loader';
import { useNavigation } from '@react-navigation/native';
import HeaderWithBackButton from './HeaderWithBackButton';


const EpisodeDetailScreen = ({ route }) => {
    const { tvId, seasonNumber, episodeNumber } = route.params;
    const [episodeDetails, setEpisodeDetails] = useState({});
    const [episodeImages, setEpisodeImages] = useState([]);
    const [episodeVideos, setEpisodeVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const handleGuestStarPress = (star) => {
        navigation.navigate('CastDetail', { personId: star.id });
        console.id
    };

    useEffect(() => {
        const fetchEpisodeData = async () => {
            try {
                const [detailsResponse, imagesResponse, videosResponse] = await Promise.all([
                    fetch(getEpisodeDetails(tvId, seasonNumber, episodeNumber), {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                            accept: 'application/json'
                        }
                    }),
                    fetch(getEpisodeImages(tvId, seasonNumber, episodeNumber), {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                            accept: 'application/json'
                        }
                    }),
                    fetch(getEpisodeVideos(tvId, seasonNumber, episodeNumber), {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                            accept: 'application/json'
                        }
                    })
                ]);

                const [detailsData, imagesData, videosData] = await Promise.all([
                    detailsResponse.json(),
                    imagesResponse.json(),
                    videosResponse.json()
                ]);

                setEpisodeDetails(detailsData);
                setEpisodeImages(imagesData.stills);
                setEpisodeVideos(videosData.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodeData();
    }, [tvId, seasonNumber, episodeNumber]);

    if (loading) {
        return <Loader />;
    }

    return (
        <View style={styles.outerContainer}>
            <HeaderWithBackButton title="Tv Series Cast" />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${episodeDetails.still_path}` }} style={styles.image} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>{episodeNumber}. {episodeDetails.name}</Text>
                        <View style={styles.chipContainer}>
                            <View style={styles.detailContainer}>
                                <MaterialCommunityIcons name="calendar" size={20} color="#245d94" />
                                <Text style={styles.releaseText}>{episodeDetails.air_date}</Text>
                            </View>
                        </View>
                        <View style={styles.ratingContainer}>
                            <RatingCircle rating={episodeDetails.vote_average} />
                            <View style={styles.voteContainer}>
                                <Text style={styles.scoreText}>User Score</Text>
                                <Text style={styles.scoreText}>({episodeDetails.vote_count} votes)</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.overviewContainer}>
                    <Text style={styles.overviewTitle}>Overview</Text>
                    <Text style={styles.overviewText}>{episodeDetails.overview}</Text>
                </View>
                <View style={styles.overviewContainer}>
                    <Text style={styles.guestStarsTitle}>Guest Stars</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {episodeDetails.guest_stars?.map(star => (
                            <TouchableOpacity key={star.id} style={styles.guestStar} onPress={() => handleGuestStarPress(star)}>
                                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${star.profile_path}` }} style={styles.guestStarImage} />
                                <Text style={styles.guestStarName} ellipsizeMode='tail' numberOfLines={1}>{star.name}</Text>
                                <Text style={styles.guestStarCharacter} ellipsizeMode='tail' numberOfLines={2}>{star.character}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View>
                    <TVSeriesTabContainer videos={episodeVideos} posters={episodeImages} loading={loading} />
                </View>
            </ScrollView>
        </View>

    );
};

export default EpisodeDetailScreen;

const styles = StyleSheet.create({
    outerContainer:{
        flex:1
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        padding: 10
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F3F8',
        marginEnd: 10,
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 15,
        marginTop: 10
    },
    chipContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    releaseText: {
        fontFamily: "Roboto-Medium",
        marginStart: 5
    },
    image: {
        width: 110,
        height: 160,
        borderRadius: 10
    },
    headerInfo: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '80%',
    },
    score: {
        fontSize: 16,
        color: '#666'
    },
    overviewContainer: {
        padding: 5,
        backgroundColor: "#F0F3F8",
        margin: 5,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    overviewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    overviewText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Roboto-Regular'
    },
    guestStarsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    guestStar: {
        marginRight: 10
    },
    guestStarImage: {
        width: 100,
        height: 150,
        borderRadius: 10
    },
    guestStarName: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        width: 100,
        paddingVertical:4
    },
    guestStarCharacter: {
        fontSize: 14,
        color: '#666',
        width: 100,
        paddingVertical:4
    },
    mediaContainer: {
        padding: 10
    },
    mediaTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    stillImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginEnd: 10
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    voteContainer: {
        marginStart: 10,
        flexDirection: 'column', // Ensure the items are laid out in a column
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
    },
});
