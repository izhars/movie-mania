import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Alert, Image, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BEARER_TOKEN } from './config';
import Loader from './Loader';
import RatingCircleSmall from './RatingCircleSmall';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const [backgroundPoster, setBackgroundPoster] = useState('');
    const [results, setResults] = useState({
        movies: [],
        tvShows: [],
        people: [],
        companies: [],
        collections: [],
        keywords: [],
        totalMovies: 0,
        totalShows: 0,
        totalPeople: 0,
        totalCompanies: 0,
        totalCollections: 0,
        totalKeywords: 0,
    });

    const [dropdowns, setDropdowns] = useState({
        movies: false,
        tvShows: false,
        people: false,
        companies: false,
        collections: false,
        keywords: false,
    });

    const toggleDropdown = (category) => {
        setDropdowns((prevState) => ({ ...prevState, [category]: !prevState[category] }));
    };

    const fetchRandomPoster = async () => {
        const headers = {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8',
        };

        try {
            const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', { headers });
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const randomPoster = data.results[randomIndex].poster_path;

            if (randomPoster) {
                setBackgroundPoster(`https://image.tmdb.org/t/p/original/${randomPoster}`);
            }
        } catch (error) {
            console.error('Error fetching random poster:', error);
        }
    };

    React.useEffect(() => {
        fetchRandomPoster();
    }, []);

    const handleSearch = async () => {
        const headers = {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8',
        };

        setIsLoading(true);

        try {
            const [movieResponse, tvResponse, peopleResponse, companyResponse, collectionResponse, keywordResponse] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&include_adult=true&language=en-US`, { headers }),
                fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(searchQuery)}&include_adult=true&language=en-US`, { headers }),
                fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(searchQuery)}&include_adult=true&language=en-US`, { headers }),
                fetch(`https://api.themoviedb.org/3/search/company?query=${encodeURIComponent(searchQuery)}`, { headers }),
                fetch(`https://api.themoviedb.org/3/search/collection?query=${encodeURIComponent(searchQuery)}&include_adult=true&language=en-US`, { headers }),
                fetch(`https://api.themoviedb.org/3/search/keyword?query=${encodeURIComponent(searchQuery)}&page=1`, { headers }),
            ]);

            const [movieData, tvData, peopleData, companyData, collectionData, keywordData] = await Promise.all([
                movieResponse.json(),
                tvResponse.json(),
                peopleResponse.json(),
                companyResponse.json(),
                collectionResponse.json(),
                keywordResponse.json(),
            ]);

            setResults({
                movies: movieData.results,
                tvShows: tvData.results,
                people: peopleData.results,
                companies: companyData.results,
                collections: collectionData.results,
                keywords: keywordData.results,
                totalMovies: movieData.total_results,
                totalShows: tvData.total_results,
                totalPeople: peopleData.total_results,
                totalCompanies: companyData.total_results,
                totalCollections: collectionData.total_results,
                totalKeywords: keywordData.total_results,

            });
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setResults({
            movies: [],
            tvShows: [],
            people: [],
            companies: [],
            collections: [],
            keywords: [],
        });
        setDropdowns({
            movies: false,
            tvShows: false,
            people: false,
            companies: false,
            collections: false,
            keywords: false,
        });
    };

    const handleItemPress = (source, item) => {
        
        if (source === "movie") {
            navigation.navigate('MovieDetail', { movieId: item.id });
        } else if (source === "tv") {
            navigation.navigate('TvDetailScreen', { id: item.id });
        }
        else if (source === "person") {
            navigation.navigate('CastDetail', { personId: item.id });
        }
        else if (source === "company") {
            navigation.navigate('CompanyScreen', { companyId: item.id });
        }
        else if (source === "collection") {
            navigation.navigate('CollectionScreen', { collectionId: item.id });
        }
    };

    const handleMovieClick = () => {
        console.log("search query: ", searchQuery)
        navigation.navigate("MoreMoviesScreen", { query: searchQuery, type: "movie" })
    };
    const handleTvClick = () => {
        console.log("search query: ", searchQuery)
        navigation.navigate("MoreMoviesScreen", { query: searchQuery, type: "tvShow" })
    };
    const handlePeoplelick = () => {
        // console.log("search query: ", searchQuery)
        // navigation.navigate("MoreMoviesScreen",{query:searchQuery, type: "tvShow"})
    };
    const handleCollectionClick = () => {
        console.log("search query: ", searchQuery)
        navigation.navigate("MoreMoviesScreen", { query: searchQuery, type: "collection" })
    };
    const handleCompanyClick = () => {
        console.log("search query: ", searchQuery)
        navigation.navigate("MoreMoviesScreen", { query: searchQuery, type: "company" })
    };


    const renderMovies = () => (
        <View style={styles.categoryContainer}>
            <View style={styles.movieHeader}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>Movies ({results.totalMovies})</Text>
                    <TouchableOpacity onPress={() => toggleDropdown('movies')} style={styles.dropdownHeader}>
                        <Icon name={dropdowns.movies ? "chevron-up" : "chevron-down"} color={"#0056b3"} size={20} padding={5} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleMovieClick} style={styles.moreTextContainer}>
                    <Text style={[styles.moreText, { marginLeft: 5 }]}>
                        {dropdowns.movies ? "More" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

            {dropdowns.movies && (
                <FlatList
                    data={results.movies}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.cardContainer} onPress={() => handleItemPress("movie", item)}>
                            <View style={styles.itemContainer}>
                                {item.poster_path ? (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                                        style={styles.poster}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.poster, styles.placeholder]}>
                                        <Text>No Image Available</Text>
                                    </View>
                                )}
                                <View style={styles.detailContainer}>
                                    <View style={styles.voteContainer}>
                                        <RatingCircleSmall
                                            rating={item.vote_average !== undefined ? parseFloat(item.vote_average.toFixed(1)) : 'N/A'}
                                        />
                                    </View>
                                    <Text style={styles.movieTitle} numberOfLines={2} ellipsizeMode="tail">
                                        {item.title}
                                    </Text>
                                    <Text style={styles.releaseDate}>{item.release_date}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderTvShows = () => (
        <View style={styles.categoryContainer}>
            <View style={styles.movieHeader}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>TV Shows ({results.totalShows})</Text>
                    <TouchableOpacity onPress={() => toggleDropdown('tvShows')} style={styles.dropdownHeader}>
                        <Icon name={dropdowns.tvShows ? "chevron-up" : "chevron-down"} color={"#0056b3"} size={20} padding={5}  />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleTvClick} style={styles.moreTextContainer}>
                    <Text style={[styles.moreText, { marginLeft: 5 }]}>
                        {dropdowns.tvShows ? "More" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

            {dropdowns.tvShows && (
                <FlatList
                    data={results.tvShows}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.cardContainer} onPress={() => handleItemPress("tv", item)}>
                            <View style={styles.itemContainer}>
                                {item.poster_path ? (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                                        style={styles.poster}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.poster, styles.placeholder]}>
                                        <Text>No Image Available</Text>
                                    </View>
                                )}
                                <View style={styles.detailContainer}>
                                    <View style={styles.voteContainer}>
                                        <RatingCircleSmall rating={item.vote_average.toFixed(1)} />
                                    </View>
                                    <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                    <Text style={styles.releaseDate}>{item.first_air_date}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderPeople = () => (
        <View style={styles.categoryContainer}>
            <View style={styles.movieHeader}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>People ({results.totalPeople})</Text>
                    <TouchableOpacity onPress={() => toggleDropdown('people')} style={styles.dropdownHeader}>
                        <Icon name={dropdowns.people ? "chevron-up" : "chevron-down"} color={"#0056b3"} size={20} padding={5} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handlePeoplelick} style={styles.moreTextContainer}>
                    <Text style={[styles.moreText, { marginLeft: 5 }]}>
                        {dropdowns.people ? "More" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

            {dropdowns.people && (
                <FlatList
                    data={results.people}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.cardContainer} onPress={() => handleItemPress("person", item)}>
                            <View style={styles.itemContainer}>
                                {item.profile_path ? (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}` }}
                                        style={styles.poster}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.poster, styles.placeholder]}>
                                        <Text>No Image Available</Text>
                                    </View>
                                )}
                                <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                                    {item.name}
                                </Text>
                                <Text style={styles.releaseDate}>{item.known_for_department}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderCompanies = () => (
        <View style={styles.categoryContainer}>
            <View style={styles.movieHeader}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>Companies ({results.totalCompanies})</Text>
                    <TouchableOpacity onPress={() => toggleDropdown('companies')} style={styles.dropdownHeader}>
                        <Icon name={dropdowns.companies ? "chevron-up" : "chevron-down"} color={"#0056b3"} size={20}  padding={5}  />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleCompanyClick} style={styles.moreTextContainer}>
                    <Text style={[styles.moreText, { marginLeft: 5 }]}>
                        {dropdowns.companies ? "More" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

            {dropdowns.companies && (
                <FlatList
                    data={results.companies}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.cardContainer} onPress={() => handleItemPress("company", item)}>
                            <View style={styles.itemContainer}>
                                {item.logo_path ? (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.logo_path}` }}
                                        style={styles.poster}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={[styles.poster, styles.placeholder]}>
                                        <Text>No Image Available</Text>
                                    </View>
                                )}
                                <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                                    {item.name}
                                </Text>
                                <Text style={styles.releaseDate}>{item.origin_country}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderCollections = () => (
        <View style={styles.categoryContainer}>
            <View style={styles.movieHeader}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>Collections ({results.totalCollections})</Text>
                    <TouchableOpacity onPress={() => toggleDropdown('collections')} style={styles.dropdownHeader}>
                        <Icon name={dropdowns.collections ? "chevron-up" : "chevron-down"} color={"#0056b3"} size={20} padding={5} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleCollectionClick} style={styles.moreTextContainer}>
                    <Text style={[styles.moreText, { marginLeft: 5 }]}>
                        {dropdowns.collections ? "More" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

            {dropdowns.collections && (
                <FlatList
                    data={results.collections}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.cardContainer} onPress={() => handleItemPress("collection", item)}>
                            <View style={styles.itemContainer}>
                                {item.poster_path ? (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                                        style={styles.poster}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.poster, styles.placeholder]}>
                                        <Text>No Image Available</Text>
                                    </View>
                                )}
                                <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderKeywords = () => (
        <View style={styles.categoryContainer}>
            <View style={styles.movieHeader}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>Keywords ({results.totalKeywords})</Text>
                    <TouchableOpacity onPress={() => toggleDropdown('keywords')} style={styles.dropdownHeader}>
                        <Icon name={dropdowns.keywords ? "chevron-up" : "chevron-down"} color={"#0056b3"} size={20} padding={5}  />
                    </TouchableOpacity>
                </View>
            </View>

            {dropdowns.keywords && (
                <View style={styles.gridContainer}>
                    {results.keywords.map((item) => (
                        <View key={item.id}>
                            <Text style={styles.keyword} numberOfLines={1} ellipsizeMode="tail">
                                {item.name}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a movie, tv show..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                        <Icon name="close-circle" size={20} color="#000" />
                    </TouchableOpacity>
                )}

                {/* Search Button */}
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                        Keyboard.dismiss();
                        if (searchQuery === "") {
                            return;
                        }
                        handleSearch(); 
                    }}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Loader />
                    </View>
                ) : (
                    <>
                        {results.movies && results.movies.length > 0 && renderMovies()}
                        {results.tvShows && results.tvShows.length > 0 && renderTvShows()}
                        {results.people && results.people.length > 0 && renderPeople()}
                        {results.companies && results.companies.length > 0 && renderCompanies()}
                        {results.collections && results.collections.length > 0 && renderCollections()}
                        {results.keywords && results.keywords.length > 0 && renderKeywords()}
                        {!results.movies && !results.tvShows && !results.people && !results.companies && !results.collections && !results.keywords && (
                            <Text>No data available</Text>
                        )}
                    </>
                )}
            </ScrollView >
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#fff', // Fallback color
        position: 'relative',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.3, // Adjust opacity to make text more readable
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    moreTextContainer: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginEnd: 10,
        paddingStart:10
    },
    clearButton: {
        paddingHorizontal: 8,
    },
    searchButton: {
        backgroundColor: '#0056b3',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryTitle: {
        fontSize: 18,
        fontFamily: "Roboto-Bold",
        marginEnd: 10
    },
    keyword: {
        borderWidth: 1,
        borderRadius: 25,
        padding: 8,
        color: 'white',
        backgroundColor: '#1360a4'
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginEnd: 5,
        marginTop: 5,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        width: 120
    },
    itemContainer: {
        padding: 5,
    },
    poster: {
        width: "100%",
        height: 170,
        borderRadius: 10,
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    logo: {
        width: 50,
        height: 30,
        borderRadius: 10,
    },
    movieTitle: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        marginTop: 15,
        width: 100,
        maxWidth: 100,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    dropdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreText: {
        fontSize: 14,
        color: '#0056b3',
    },
    movieHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f1f4fb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1e6ec'
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
    detailContainer: {
        flex: 1,
        position: 'relative',
    },
    voteContainer: {
        position: 'absolute',
        top: -20,
        right: 5,
        alignItems: 'center',
    },
});
