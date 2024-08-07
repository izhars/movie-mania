import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BEARER_TOKEN } from './config';

const CompanyScreen = ({ route, navigation }) => {
    const { companyId } = route.params;
    const [company, setCompany] = useState({});
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [selectedTab, setSelectedTab] = useState('movies');

    useEffect(() => {
        fetchCompanyDetails();
        fetchCompanyMovies();
        fetchCompanyTVShows();
    }, []);

    const fetchCompanyDetails = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/company/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });
            setCompany(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompanyMovies = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?with_companies=${companyId}`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });
            setMovies(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompanyTVShows = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?with_companies=${companyId}`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });
            setTvShows(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
            <View>
                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.release_date}>{item.release_date}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderTVShowItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TvDetailScreen', { id: item.id })}>
            <View>
                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.release_date}>{item.first_air_date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} />
                </TouchableOpacity>
                {company.logo_path && (
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${company.logo_path}` }} style={styles.logo} />
                )}
                <TouchableOpacity onPress={() => console.log('Menu Pressed')}>
                    <MaterialIcons name="menu" size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.companyDetails}>
                <View style={styles.detailItem}>
                    <MaterialIcons name="business" size={24} />
                    <Text style={styles.detailText}>{company.name}</Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialIcons name="place" size={24} />
                    <Text style={styles.detailText}>{company.headquarters}</Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialIcons name="flag" size={24} />
                    <Text style={styles.detailText}>{company.origin_country}</Text>
                </View>
            </View>
            <View style={styles.sectionOuter}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={selectedTab === 'movies' ? styles.activeTab : styles.tab} onPress={() => setSelectedTab('movies')}>
                        <Text style={styles.tabText}>Movies</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={selectedTab === 'tvShows' ? styles.activeTab : styles.tab} onPress={() => setSelectedTab('tvShows')}>
                        <Text style={styles.tabText}>TV Shows</Text>
                    </TouchableOpacity>
                </View>
                {selectedTab === 'movies' ? (
                    <FlatList
                        data={movies}
                        numColumns={2}
                        renderItem={renderMovieItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={tvShows}
                        numColumns={2}
                        renderItem={renderTVShowItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

export default CompanyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionOuter: {
        backgroundColor: "#F0F3F8",
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        flex: 1, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },
    companyDetails: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        padding: 10,
    },
    item: {
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        flex: 1,
        margin: 5,
        maxWidth: '50%',
    },
    poster: {
        width: '100%',
        height: 260,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    release_date: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
});
