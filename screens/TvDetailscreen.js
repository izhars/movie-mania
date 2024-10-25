import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, FlatList, ImageBackground } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    BEARER_TOKEN, getTvDetailsUrl, getTvCreditsUrl, getSimilarTvSeries, getTvSeriesReview, getTvYoutubeVideosUrl, getTvWatchProvidersUrl,
    getTvBackdrops, getTvRecommnedation, getTvKeywords
} from './config';
import { ScrollView } from 'react-native-virtualized-view';
import WatchProvider from './WatchProvider';
import Loader from './Loader';
import RatingCircle from './RatingCircle'; // Adjust the import path as needed
import Ionicons from 'react-native-vector-icons/Ionicons';
import Cast from './Cast';
import LinearGradient from 'react-native-linear-gradient';
import SocialIcons from './SocialIcons'; // Adjust the path as needed
import TabContainerWithBd from './TabContainerWithBd'
import TvRecmondTab from './TvRecmondTab';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderWithBackButton from './HeaderWithBackButton';

const TvDetailScreen = ({ route }) => {
    const { id } = route.params;
    console.log("sbdufb", id)
    const navigation = useNavigation();
    const [tvShow, setTvShow] = useState(null);
    const [cast, setCast] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [watchProviders, setWatchProviders] = useState(null); // Initialize watchProviders state
    const [posters, setPoster] = useState([]);
    const [backdrops, setBackdrops] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [keyword, setKeyword] = useState([]);
    const [externalId, setExternalId] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetchMovieData();
    }, [id]);

    const formatPublishedDate = (dateString) => {
        if (dateString) {
          const date = new Date(dateString);
          const options = { day: 'numeric', month: 'short', year: 'numeric' };
          return date.toLocaleDateString('en-IN', options).replace(' ', ', ');
        }
        return '';
      };
    


    const fetchMovieData = async () => {
        try {
            const [tvDetailsResponse, castResponse, similarTvResponse, reviewsResponse, videoResponse, watchProvidersResponse, backdropsResponse, recommendedResponse, keywordResponse] = await Promise.all([
                fetch(getTvDetailsUrl(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvCreditsUrl(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getSimilarTvSeries(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvSeriesReview(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvYoutubeVideosUrl(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvWatchProvidersUrl(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvBackdrops(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvRecommnedation(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(getTvKeywords(id), {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }),
            ]);

            const tvDetailsData = await tvDetailsResponse.json();
            const castData = await castResponse.json();
            const similarTvData = await similarTvResponse.json();
            const reviewsData = await reviewsResponse.json();
            const videoData = await videoResponse.json();
            const watchProvidersData = await watchProvidersResponse.json();
            const backdropsData = await backdropsResponse.json();
            const recommendedData = await recommendedResponse.json();
            const keywordData = await keywordResponse.json();

            setTvShow(tvDetailsData);
            setCast(castData.cast);
            setSimilarMovies(similarTvData.results);
            setReviews(reviewsData.results);
            setVideos(videoData.results);
            setBackdrops(backdropsData.backdrops);
            setPoster(backdropsData.posters);
            setRecommended(recommendedData.results);
            setKeyword(keywordData.results);
            setExternalId(tvDetailsData.external_ids)

            if (watchProvidersData.results && watchProvidersData.results.IN) {
                setWatchProviders(watchProvidersData.results.IN);
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

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    if (error || !tvShow) {
        return (
            <View style={styles.errorContainer}>
                <Title>Error fetching data!</Title>
            </View>
        );
    }

    const lastSeason = tvShow.seasons[tvShow.seasons.length - 1];
    const nextEpisode = tvShow.next_episode_to_air;

    const renderItem = ({ item }) => (
        <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
            style={styles.logo}
        />
    );

    const renderReviewItem = ({ item }) => {
        const { author, content, created_at, author_details } = item;

        return (
            <View style={styles.section}>
                <View style={styles.reviewContainer}>
                    <View style={styles.iconContainer}>
                        {author_details.avatar_path ? (
                            <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${author_details.avatar_path}` }} style={styles.profileImage} />
                        ) : (
                            <Icon name="account-circle" size={50} color="#135796" />
                        )}
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.reviewTitle} color="red">A review by </Text>
                            <Text style={styles.text}>{author}</Text>
                        </View>
                        <Text style={styles.subtitle}>Written by {author} on {formatPublishedDate(created_at)}</Text>
                        {author_details.rating && <Text style={styles.ratingText}>Rating: {author_details.rating}/10</Text>}
                        <Text style={styles.reviewText} ellipsizeMode='tail' numberOfLines={5}>{content}</Text>
                    </View>
                </View>
                {reviews.length > 1 && (
                    <TouchableOpacity
                        style={styles.buttonSeason}
                        onPress={() => navigation.navigate('ReviewScreen', { movieId: '', tvShowId: tvShow.id, title: tvShow.name, type: 'tvShow' })}
                    >
                        <Text style={styles.buttonText}>Read All Reviews</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.outerContainer}>
            <HeaderWithBackButton title="Tv Series Details" />
            {/* Background Image */}
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={{ uri: `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}` }}
                        style={styles.backdropImage}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.9)']}
                            style={styles.gradient}
                        />
                    </ImageBackground>
                </View>

                {/* Image poster and details */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` }}
                        style={styles.posterImage}
                    />
                    <View style={styles.absoluteContainer}>
                        <Text style={styles.movieTitle}>{tvShow.name}</Text>
                        <View style={styles.chipContainer}>
                            <View style={styles.detailContainer}>
                                <MaterialCommunityIcons name="calendar" size={20} color="#245d94" />
                                <Text style={styles.releaseText}>{formatPublishedDate(tvShow.first_air_date)}</Text>
                            </View>
                        </View>
                        <View style={styles.genresContainer}>
                            {tvShow.genres.map((genre, index) => (
                                <View key={index} style={styles.genre}>
                                    <Text style={styles.genreColor}>
                                        {genre.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.ratingContainer}>
                            <RatingCircle rating={tvShow.vote_average.toFixed(1)} />
                            <View style={styles.voteContainer}>
                                <Text style={styles.scoreText}>User Score</Text>
                                <Text style={styles.scoreText}>({tvShow.vote_count} votes)</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={styles.tagline}>"{tvShow.tagline}"</Text>

                {/* List Container */}
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
                    <Text style={styles.overview}>{tvShow.overview}</Text>
                </View>

                {/* About Movie */}
                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>About movie</Text>
                    <SocialIcons externalIds={externalId} />
                    <View style={styles.details}>
                        <Text style={styles.detailHeader}>Creators</Text>
                        <ScrollView
                            contentContainerStyle={styles.scrollContainer}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <Text style={styles.text}>
                                {tvShow.created_by.map((creator) => creator.name).join(', ')}
                            </Text>
                        </ScrollView>

                        <Text style={styles.detailHeader}>Networks</Text>
                        {tvShow.networks && tvShow.networks.length > 0 ? (
                            <FlatList
                                data={tvShow.networks}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.flatListContainer}
                            />
                        ) : (
                            <Text style={styles.placeholderText}>No networks available</Text>
                        )}
                        <Text style={styles.detailHeader}>Status</Text>
                        <Text style={styles.text}>{tvShow.status}</Text>
                        <Text style={styles.detailHeader}>Original Language</Text>
                        <Text style={styles.text}>{tvShow.original_language}</Text>
                        <Text style={styles.detailHeader}>Type</Text>
                        <Text style={styles.text}>{tvShow.type}</Text>
                        <Text style={styles.detailHeader}>Number of seasons</Text>
                        <Text style={styles.text}>{tvShow.number_of_seasons}</Text>
                        <Text style={styles.detailHeader}>Number of episodes</Text>
                        <Text style={styles.text}>{tvShow.number_of_episodes}</Text>
                        <Text style={styles.detailHeader}>Production Countries</Text>
                        {tvShow.production_countries.map((country, index) => (
                            <Paragraph key={index} style={styles.text}>
                                {country.name}
                            </Paragraph>
                        ))}
                        <Text style={styles.detailHeader}>Production Companies:</Text>
                        <View style={styles.companiesContainer}>
                            {tvShow.production_companies.map((company, index) => (
                                <Text key={index} style={styles.companyText}>{company.name}</Text>
                            ))}
                        </View>
                        <Text style={styles.detailHeader}>Keywords</Text>
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

                {/* Current Season */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Current Season</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('TVSeasonScreen', { seriesId: tvShow.id, seasonNumber: lastSeason.season_number })}>
                        <View style={styles.contentSeason}>
                            {lastSeason.poster_path ? (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${lastSeason.poster_path}` }}
                                    style={styles.poster}
                                />
                            ) : (
                                <View style={[styles.poster, styles.placeholderImage]}>
                                    <Text style={styles.placeholderText}>No Image Available</Text>
                                </View>
                            )}
                            <View style={styles.info}>
                                <Text style={styles.seasonTitle}>{lastSeason.name}</Text>
                                <Text style={styles.seasonSubtitle}>{new Date(lastSeason.air_date).getFullYear()} • {lastSeason.episode_count} Episodes</Text>
                                <Text style={styles.overview}>Season {lastSeason.season_number} of {tvShow.name} premiered on {formatPublishedDate(lastSeason.air_date)}.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Next Episodes */}
                    {nextEpisode && (
                        <>
                            <Text style={styles.sectionTitle}>Next Episode</Text>
                            <View style={styles.contentSeason}>
                                <TouchableOpacity onPress={() => navigation.navigate('EpisodeDetailScreen', { tvId: nextEpisode.id, seasonNumber: nextEpisode.season_number, episodeNumber: nextEpisode.episode_number })}>
                                    {nextEpisode.still_path ? (
                                        <Image
                                            source={{ uri: `https://image.tmdb.org/t/p/w500${nextEpisode.still_path}` }}
                                            style={styles.posterSeason}
                                        />
                                    ) : (
                                        <View style={[styles.posterSeason, styles.placeholderImage]}>
                                            <Text style={styles.placeholderText}>No Image Available</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <View style={styles.info}>
                                    <Text style={styles.seasonTitle}>{nextEpisode.name}</Text>
                                    <Text style={styles.seasonSubtitle}>{nextEpisode.air_date}</Text>
                                </View>
                            </View>
                        </>
                    )}

                    <TouchableOpacity style={styles.buttonSeason}
                        onPress={() => navigation.navigate('ViewAllSeasons', { tvId: tvShow.id })}>
                        <Text style={styles.buttonText}>View All Seasons</Text>
                    </TouchableOpacity>
                </View>

                {/* Media */}
                <TabContainerWithBd videos={videos} posters={posters} backdrops={backdrops} loading={isLoading} />

                {/* Cast */}
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
                    <TouchableOpacity style={styles.buttonSeason}
                        onPress={() => navigation.navigate('TVSeasonCast', { seriesId: tvShow.id })}>
                        <Text style={styles.buttonText}>View All Cast</Text>
                    </TouchableOpacity>
                </View>

                {/* Collections */}
                {tvShow.belongs_to_collection && (
                    <>
                        <View style={styles.section}>
                            <View style={styles.collContainer}>
                                <Image
                                    source={{
                                        uri: tvShow.belongs_to_collection.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${tvShow.belongs_to_collection.poster_path}`
                                            : 'https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png',
                                    }}
                                    style={styles.collImage}
                                />
                                <View style={styles.textContainer}>
                                    {tvShow.belongs_to_collection.name && (
                                        <Text style={styles.title}>{tvShow.belongs_to_collection.name}</Text>
                                    )}
                                    <View style={styles.box}>
                                        <TouchableOpacity onPress={() => navigation.navigate('CollectionScreen', { collectionId: tvShow.belongs_to_collection.id })}>
                                            <Text style={styles.collBox}>View The Collection</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* Just Watch */}
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

                {/* <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Reviews</Text>
                    <ReviewCard review={firstReview} />
                </View> */}
                <TvRecmondTab recommended={recommended} similarSeries={similarMovies} loading={isLoading} navigation={navigation} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1
    },
    imageContainer: {
        position: 'relative',
    },
    backdropImage: {
        width: '100%',
        height: 250, // Adjust the height as needed
        justifyContent: 'flex-end', // Ensures the gradient is at the bottom
        position: 'absolute',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
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
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    posterImage: {
        width: 120,
        height: 180,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    absoluteContainer: {
        margin: 5,
        flex: 1
    },
    titleContainer: {
        flexDirection: 'row'
    },
    movieTitle: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: 'white',
        marginBottom: 10,
    },
    overview: {
        fontSize: 16,
        fontFamily: "Roboto-Regular",
        color: 'gray'
    },
    logo: {
        width: 50,
        height: 50,
        margin: 5,
        resizeMode: 'contain',
        borderRadius: 5,
        borderWidth: 1,
        padding: 5,
        borderColor: 'lightgray'
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText:{
        fontSize:14,
        color:'black',
        fontFamily:'Roboto-Semibold'
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
        margin: 5,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    placeholderText: {
        fontSize: 16,
        color: 'gray'
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        marginTop: 10,
        color: 'black'
    },
    socialIcons: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    detailHeader: {
        fontSize: 14,
        fontFamily: "Roboto-Bold",
        color: 'gray',
        marginTop: 5
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
    tagline: {
        fontSize: 16,
        fontFamily: "Roboto-Italic",
        textAlign: 'center',
        color: 'black'
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genre: {
        fontSize: 16,
        backgroundColor: '#F0F3F8',
        marginEnd: 5,
        fontFamily: "Roboto-Medium",
        paddingStart: 10,
        marginBottom: 10,
        paddingEnd: 10,
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
        fontFamily: "Roboto-Regular",
        marginStart: 5,
        color: '#135796',
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
    },
    line: {
        height: '100%', // Adjust height as needed
        width: 1, // Width of the line
        backgroundColor: '#135796', // Color of the line
        marginEnd: 10
    },
    details: {
        backgroundColor: '#f0f0f0', // Example background color
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 14,
        marginBottom: 5, // Space between each text element
        color: 'black',
        fontFamily: 'Roboto-Medium'
    },
    companiesContainer: {
        flexDirection: 'row', // Arrange items in a row
        flexWrap: 'wrap', // Wrap to the next line if there are too many items
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
        width: 100, // Adjust width as needed based on your design
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
        height: 180, // Adjust the height as needed
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
    collBox: {
        fontFamily: "Roboto-Medium",
        color: '#135796',
        padding: 8,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'lightgray',
        fontSize: 15,
        marginTop: 30,
    },
    box: {
        flexDirection: 'row',
        alignContent: 'space-between'
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
    movieOverview: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Roboto-Regular',
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
    contentSeason: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    posterSeason: {
        width: 100,
        height: 150,
        borderRadius: 10,
        marginRight: 15,
    },
    info: {
        flex: 1,
        marginStart: 10,
    },
    seasonTitle: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginBottom: 5,
        color: 'black'
    },
    seasonSubtitle: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        color: '#000',
        marginBottom: 10,
    },
    overviewSeason: {
        fontSize: 14,
        color: '#333',
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
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    reviewContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    iconContainer: {
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginStart: 10
    },
    title: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        color: 'black'
    },
    reviewTitle: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color:'#808080'
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
        fontFamily: 'Roboto-Italic'
    },
    reviewText: {
        fontSize: 14,
        color: 'gray',
        fontFamily:'Roboto-Regular'
    },
    seeMore: {
        fontSize: 14,
        color: '#135796',
        marginTop: 5,
    },
});

export default TvDetailScreen;
