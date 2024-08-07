import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, FlatList, ImageBackground, UIManager, Platform } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    BEARER_TOKEN, getMovieDetailsUrl, getMovieCreditsUrl, getSimilarMoviesUrl, getMovieReviewsUrl, getYoutubeVideosUrl, getWatchProvidersUrl,
    getMovieReleaseDate, getMovieBackdrops, getRecommendation, getKeywords
} from './config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-virtualized-view'
import WatchProvider from './WatchProvider'
import Loader from './Loader';
import RatingCircle from './RatingCircle'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import Cast from './Cast';
import ReleaseDetails from './ReleaseDetails';
import SocialIcons from './SocialIcons'; 
import TabContainerWithBd from './TabContainerWithBd'
import MovieRecmondTab from './MovieRecmondTab'
import LinearGradient from 'react-native-linear-gradient';
import HeaderWithBackButton from './HeaderWithBackButton';

const MovieDetailScreen = ({ route }) => {
    const { movieId } = route.params;
    const navigation = useNavigation();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [watchProviders, setWatchProviders] = useState(null);
    const [releaseDates, setReleaseDates] = useState([]);
    const [poster, setPoster] = useState([]);
    const [backdrops, setBackdrops] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [keyword, setKeyword] = useState([]);
    const [externalId, setExternalId] = useState([]);

    const getIndiaReleaseDates = () => {

        if (!Array.isArray(releaseDates) || releaseDates.length === 0) {
            console.warn("Release dates array is empty or not an array:", releaseDates);
            return [];
        }

        const indiaRelease = releaseDates.find(result => result.iso_3166_1 === 'IN');
        return indiaRelease ? indiaRelease.release_dates : [];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchMovieData();
    }, [movieId]);

    const fetchMovieData = async () => {
        try {
            const [movieDetailsResponse, castResponse, similarMoviesResponse, reviewsResponse, videoResponse, watchProvidersResponse, releaseDateResponse, backdropsResponse, recommendedResponse, keywordResponse] = await Promise.all([
                fetch(getMovieDetailsUrl(movieId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getMovieCreditsUrl(movieId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getSimilarMoviesUrl(movieId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getMovieReviewsUrl(movieId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getYoutubeVideosUrl(movieId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getWatchProvidersUrl(movieId), { 
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getMovieReleaseDate(movieId), { 
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getMovieBackdrops(movieId), { 
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getRecommendation(movieId), { 
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getKeywords(movieId), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
            ]);

            const movieDetailsData = await movieDetailsResponse.json();
            const castData = await castResponse.json();
            const similarMoviesData = await similarMoviesResponse.json();
            const reviewsData = await reviewsResponse.json();
            const videoData = await videoResponse.json();
            const watchProvidersData = await watchProvidersResponse.json();
            const movieReleaseData = await releaseDateResponse.json();
            const backdropsData = await backdropsResponse.json();
            const recommendedData = await recommendedResponse.json();
            const keywordData = await keywordResponse.json();

            setMovie(movieDetailsData);
            setCast(castData.cast);
            setSimilarMovies(similarMoviesData.results);
            setReviews(reviewsData.results);
            setVideos(videoData.results);
            setBackdrops(backdropsData.backdrops);
            setPoster(backdropsData.posters)
            setRecommended(recommendedData.results);
            setKeyword(keywordData.keywords);
            setReleaseDates(movieReleaseData.results);
            setExternalId(movieDetailsData.external_ids);
            console.log("Movie Detail data: ",movieDetailsData);

            if (watchProvidersData.results && watchProvidersData.results.IN) {
                setWatchProviders(watchProvidersData.results.IN);
                (watchProvidersData.results.IN);
            } else {
                setWatchProviders(null);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setError(error);
            setIsLoading(false);
        }
    };

    const formatNumberWithCommas = (number) => {
        return number.toLocaleString();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    if (error || !movie) {
        return (
            <View style={styles.errorContainer}>
                <Title>Error fetching data!</Title>
            </View>
        );
    }

    const renderReviewItem = ({ item }) => {
        const { author, content, created_at, author_details } = item;
        return (
            <View style={styles.section}>
                <View style={styles.reviewContainer}>
                    <View style={styles.iconContainer}>
                        {author_details.avatar_path ? (
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w500${author_details.avatar_path}` }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Icon name="account-circle" size={50} color="#135796" />
                        )}
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.reviewTitle} color="red">A review by </Text>
                            <Text style={styles.text}>{author}</Text>
                        </View>
                        <Text style={styles.subtitle}>Written by {author} on {new Date(created_at).toLocaleDateString()}</Text>
                        {author_details.rating && <Text style={styles.ratingText}>Rating: {author_details.rating}/10</Text>}
                        <Text style={styles.reviewText} ellipsizeMode='tail' numberOfLines={5}>{content}</Text>
                    </View>
                </View>
                {reviews.length > 1 && (
                    <TouchableOpacity
                        style={styles.buttonSeason}
                        onPress={() => navigation.navigate('ReviewScreen', { movieId: movie.id, tvShowId: "", title: movie.title, type: 'movie' })}
                    >
                        <Text style={styles.buttonText}>Read All Reviews</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.outerContainer}>
            <HeaderWithBackButton title="Movie Detail" />
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <View>
                        <ImageBackground
                            source={{ uri: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` }}
                            style={styles.backdropImage}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.9)']}
                                style={styles.gradient}
                            />
                        </ImageBackground>
                    </View>
                </View>
                <View style={styles.header}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                        style={styles.posterImage}
                    />
                    <View style={styles.absoluteContainer}>
                        <Text style={styles.movieTitle}>{movie.title}</Text>
                        <View style={styles.chipContainer}>
                            <View style={styles.detailContainer}>
                                <MaterialCommunityIcons name="calendar" size={20} color="#245d94" />
                                <Text style={styles.releaseText}>{formatDate(movie.release_date)}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#245d94" />
                                <Text style={styles.releaseText}>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</Text>
                            </View>
                        </View>
                        <View style={styles.genresContainer}>
                            {movie.genres.map((genre, index) => (
                                <View key={index} style={styles.genre}>
                                    <Text style={styles.genreColor}>
                                        {genre.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.ratingContainer}>
                            <RatingCircle rating={movie.vote_average.toFixed(1)} />
                            <View style={styles.voteContainer}>
                                <Text style={styles.scoreText}>User Score</Text>
                                <Text style={styles.scoreText}>({movie.vote_count} votes)</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={styles.tagline}>"{movie.tagline}"</Text>
                <View style={styles.actionsContainer}>
                    <View style={styles.save}>
                        <View style={styles.iconBg}>
                            <Ionicons name="list" size={24} color="#000" />
                        </View>
                        <Text style={styles.listText}>List</Text>
                    </View>
                    <View style={styles.save}>
                        <View style={styles.iconBg}>
                            <Ionicons name="heart-outline" size={24} color="#000" />
                        </View>
                        <Text style={styles.listText}>Favorite</Text>
                    </View>
                    <View style={styles.save}>
                        <View style={styles.iconBg}>
                            <Ionicons name="bookmark-outline" size={24} color="#000" />
                        </View>
                        <Text style={styles.listText}>Watchlist</Text>
                    </View>
                    <View style={styles.save}>
                        <View style={styles.iconBg}>
                            <Ionicons name="star-outline" size={24} color="#000" />
                        </View>
                        <Text style={styles.listText}>Rate</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Overview</Text>
                    <Text>{movie.overview}</Text>
                </View>
                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>About movie</Text>
                    <SocialIcons externalIds={externalId} />
                    <View style={styles.details}>
                        <Text>Status</Text>
                        <Text style={styles.text}>{movie.status}</Text>
                        <Text>Original Language</Text>
                        <Text style={styles.text}>{movie.original_language}</Text>
                        <Text>Budget</Text>
                        <Text style={styles.text}>${formatNumberWithCommas(movie.budget)}</Text>
                        <Text>Revenue</Text>
                        <Text style={styles.text}>${formatNumberWithCommas(movie.revenue)}</Text>
                        <Text>Production Countries</Text>
                        {movie.production_countries.map((country, index) => (
                            <Paragraph key={index} style={styles.text}>
                                {country.name}
                            </Paragraph>
                        ))}
                        <Text>Production Companies:</Text>
                        <View style={styles.companiesContainer}>
                            {movie.production_companies.map((company, index) => (
                                <Text key={index} style={styles.companyText}>{company.name}</Text>
                            ))}
                        </View>
                        <Text>Keywords</Text>
                        <View style={styles.gridContainer}>
                            {keyword.map((item, index) => (
                                <View key={index}>
                                    <Text style={styles.keyword}>
                                        {item.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                {getIndiaReleaseDates().length > 0 && (
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Release dates • 🇮🇳</Text>
                        <View style={styles.companiesContainer}>
                            <View>
                                {getIndiaReleaseDates().map((releaseData, index) => (
                                    <View key={index}>
                                        <ReleaseDetails releaseData={releaseData} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Media */}
                <TabContainerWithBd videos={videos} posters={poster} backdrops={backdrops} loading={isLoading} />

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Top Build Cast</Text>
                    <View style={styles.companiesContainer}>
                        <FlatList
                            data={cast.slice(0, 10)}
                            keyExtractor={(item, index) => item.file_path ? item.file_path.toString() : index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Cast
                                    castMember={item}
                                    onPress={() => navigation.navigate('CastDetail', { personId: item.id })}
                                />
                            )}
                        />
                    </View>
                </View>

                {/* Collectionsx */}
                {movie.belongs_to_collection && (
                    <>
                        <View style={styles.section}>
                            <View style={styles.collContainer}>
                                <Image
                                    source={{
                                        uri: movie.belongs_to_collection.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.belongs_to_collection.poster_path}`
                                            : 'https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png',
                                    }}
                                    style={styles.collImage}
                                />
                                <View style={styles.textContainer}>
                                    {movie.belongs_to_collection.name && (
                                        <Text style={styles.title}>{movie.belongs_to_collection.name}</Text>
                                    )}

                                    <TouchableOpacity style={styles.buttonSeason}
                                        onPress={() => navigation.navigate('CollectionScreen', { collectionId: movie.belongs_to_collection.id })}>
                                        <Text style={styles.buttonText}>View The Collection</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Available on just watch</Text>
                    <WatchProvider providers={watchProviders} />
                </View>

                {/* Reviews */}
                <View style={styles.container}>
                    <FlatList
                        data={reviews.slice(0, 1)}
                        keyExtractor={(item, index) => item.file_path ? item.file_path.toString() : index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderReviewItem}
                    />
                </View>

                {/* Similar Movies */}
                <MovieRecmondTab recommended={recommended} similarMovies={similarMovies} loading={isLoading} navigation={navigation} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1
    },
    tagline: {
        fontSize: 16,
        fontFamily: "Roboto-Italic",
        textAlign: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 120
    },
    posterImage: {
        width: 120,
        height: 180,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    backdropImage: {
        width: '100%',
        height: 250,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    absoluteContainer: {
        margin: 5,
        flex: 1
    },
    movieTitle: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: 'white',
        marginBottom: 10,
    },
    chipContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        backgroundColor: "#F0F3F8",
        margin: 5,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        alignContent: 'center'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        padding: 10,
        backgroundColor: "#F0F3F8",
        margin: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        color: 'black'
    },
    socialIcons: {
        flexDirection: 'row',
        marginVertical: 10,
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
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genre: {
        backgroundColor: '#F0F3F8',
        marginEnd: 10,
        paddingStart: 10,
        paddingEnd: 10,
        marginBottom: 10,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 15,
    },
    genreColor: {
        color: '#135796',
    },
    releaseText: {
        fontFamily: "Roboto-Medium",
        marginStart: 5
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    voteContainer: {
        marginStart: 10,
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    scoreText: {
        fontSize: 14,
        fontFamily: "Roboto-Medium",
        color: '#1a1a1a'
    },
    save: {
        alignItems: 'center',
        marginVertical: 5,
    },
    listText: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        color: '#135796',
        marginTop: 5
    },
    iconBg: {
        backgroundColor: '#ddd',
        padding: 5,
        borderRadius: 10,
        marginEnd: 10
    },
    line: {
        height: '100%', 
        width: 1,
        backgroundColor: '#135796',
        marginEnd: 10
    },
    details: {
        backgroundColor: '#f0f0f0', 
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: 'black',
        fontFamily: 'Roboto-Medium'
    },
    companiesContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap',
    },
    companyText: {
        fontSize: 16,
        backgroundColor: '#F0F3F8',
        marginEnd: 5,
        fontFamily: "Roboto-Medium",
        color: '#135796',
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 15,
        marginTop: 5
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
    castTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    castMember: {
        marginRight: 10,
        alignItems: 'center',
    },
    castDetails: {
        marginTop: 5,
        alignItems: 'center',
        width: 100, 
    },
    castName: {
        fontSize: 14,
        textAlign: 'center',
    },
    castCharacter: {
        fontSize: 12,
        textAlign: 'center',
        color: 'gray',
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 10,
    },
    collContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f4ff',
        borderRadius: 10,
        alignItems: 'center',
    },
    collImage: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    keyword: {
        fontSize: 16,
        backgroundColor: '#F0F3F8',
        marginEnd: 5,
        marginTop: 5,
        fontFamily: "Roboto-Medium",
        color: '#135796',
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 15,
    },
    releaseDate: {
        fontSize: 18,
        fontFamily: 'Roboto-Medium',
        marginStart: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    releaseInfoContainer: {

    },
    releaseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    releaseDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    releaseItem: {
        alignItems: 'center'
    },
    releaseLabel: {
        fontWeight: 'bold',
    },
    reviewContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    iconContainer: {
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row'
    },
});

export default MovieDetailScreen;
