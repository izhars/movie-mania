import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BEARER_TOKEN, getPersonCombinedCreditsUrl, getPersonImagesUrl, getPersonDetailsUrl } from './config'; // Adjust the path as necessary
import Loader from './Loader';
import SocialIconsForPeople from "./SocialIconsForPeople";
import HeaderWithBackButton from './HeaderWithBackButton';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const CastDetailScreen = () => {
    const [personDetails, setPersonDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullBiography, setShowFullBiography] = useState(false);
    const [images, setImages] = useState([]);
    const [combinedCredits, setCombinedCredits] = useState([]);
    const [externalId, setExternalId] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { personId } = route.params;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const calculateAge = (dateString) => {
        const birthday = new Date(dateString);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ImageViewer', { images: images, initialIndex: index })}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.file_path}` }}
                style={styles.imageItem}
            />
        </TouchableOpacity>
    );

    useEffect(() => {
        setLoading(true);
        const fetchPersonDetails = async () => {
            try {
                const [personDetailsResponse, personImagesResponse, combinedCreditsResponse] = await Promise.all([
                    fetch(getPersonDetailsUrl(personId), {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                        },
                    }),
                    fetch(getPersonImagesUrl(personId), {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                        },
                    }),
                    fetch(getPersonCombinedCreditsUrl(personId), {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                        },
                    }),
                ]);

                if (!personDetailsResponse.ok || !personImagesResponse.ok || !combinedCreditsResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const personDetailsData = await personDetailsResponse.json();
                const personImagesData = await personImagesResponse.json();
                const combinedCreditsData = await combinedCreditsResponse.json();

                setPersonDetails(personDetailsData);
                setImages(personImagesData.profiles);
                setCombinedCredits(combinedCreditsData.cast);
                setExternalId(personDetailsData.external_ids);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonDetails();
    }, [personId]);

    const toggleBiographyLines = () => {
        setShowFullBiography(!showFullBiography);
    };

    if (loading) {
        return <Loader />;
    }

    if (!personDetails) {
        return <Text>Error loading details</Text>;
    }

    const formattedBirthday = `${formatDate(personDetails.birthday)} (${calculateAge(personDetails.birthday)} years old)`;

    return (
        <View style={styles.outerContainer}>
            <HeaderWithBackButton title="Cast Details" />
            <ScrollView style={styles.content}>
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${personDetails.profile_path}` }} style={styles.profileImage} />
                    </View>
                    <View style={styles.aboutContainer}>
                        <Text style={styles.name}>{personDetails.name}</Text>
                        <SocialIconsForPeople externalIds={externalId} />
                        <Text style={styles.headerText}>Known For</Text>
                        <Text style={styles.contentText}>{personDetails.known_for_department}</Text>
                        <Text style={styles.headerText}>Gender</Text>
                        <Text style={styles.contentText}>{personDetails.gender === 1 ? 'Female' : 'Male'}</Text>
                        <Text style={styles.headerText}>Birthday</Text>
                        <Text style={styles.contentText}>{formattedBirthday}</Text>
                        <Text style={styles.headerText}>Place Of Birth</Text>
                        <Text style={styles.contentText}>{personDetails.place_of_birth}</Text>
                    </View>
                </View>

                <View style={styles.biographyContainer}>
                    <Text style={styles.biographyTitle}>Biography</Text>
                    <Text style={styles.biographyContent}>
                        {showFullBiography ? personDetails.biography : `${personDetails.biography.slice(0, 200)}${personDetails.biography.length > 200 ? '...' : ''}`}
                    </Text>
                    {personDetails.biography.length > 200 && !showFullBiography && (
                        <TouchableOpacity onPress={toggleBiographyLines}>
                            <Text style={styles.readMore}>See more</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Image Container */}
                <View style={styles.imagesContainer}>
                    <Text style={styles.imagesTitle}>Images</Text>
                    {images && images.length > 0 ? (
                        <FlatList
                            data={images}
                            keyExtractor={(item) => item.file_path}
                            renderItem={renderItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <View style={[styles.imageItem, styles.placeholderImage]}>
                            <Text>No Image Available</Text>
                        </View>)}
                </View>

                {/* Movies and TV Series */}
                <View style={styles.creditsContainer}>
                    <Text style={styles.creditsTitle}>Credits</Text>
                    <FlatList
                        data={combinedCredits}
                        keyExtractor={(item) => item.credit_id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                if (item.media_type === 'movie') {
                                    navigation.navigate('MovieDetail', { movieId: item.id });
                                } else if (item.media_type === 'tv') {
                                    navigation.navigate('TvDetailScreen', { id: item.id });
                                }
                            }}
                            >
                                <View style={styles.creditItem}>
                                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                                        style={styles.creditImage}
                                        
                                    />
                                    <Text style={styles.creditTitle}>{item.title || item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        alignContent: 'center'
    },
    aboutContainer: {
        marginStart: 10
    },
    content: {
        padding: 10,
    },
    header: {
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        marginTop: 10,
        color:"black"
    },
    contentText: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
          color:"gray"
    },
    profileImage: {
        width: 120,
        height: 180,
        borderWidth: 1, // Thicker border for better stroke visibility
        borderColor: 'lightgray',
        borderRadius: 10, // Make the container circular
        backgroundColor: 'transparent', // Ensure transparent background
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8, // Elevation for Android shadow
    },
    name: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
          color:"black"
    },
    placeOfBirth: {
        fontSize: 16,
        fontFamily: 'Roboto-BoldItalic',
    },
    icon: {
        marginBottom: 8,
    },
    biographyContainer: {
        marginBottom: 24,
        marginVertical: 20,
        backgroundColor: "#F0F3F8",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    biographyTitle: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginBottom: 8,
        color:"black"
    },
    biographyContent: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color:'gray'
    },
    readMore: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: 'blue',
        marginTop: 8,
    },
    imagesContainer: {
        marginBottom: 24,
    },
    imagesTitle: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginBottom: 8,
          color:"black"
    },
    imageItem: {
        width: 100,
        height: 150,
        borderRadius: 10,
        marginRight: 10,
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    creditsContainer: {
        marginBottom: 24,
    },
    creditsTitle: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginBottom: 8,
          color:"black"
    },
    creditItem: {
        width: 100,
        marginRight: 16,
        alignItems: 'center',
    },
    creditImage: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginBottom: 4,
    },
    creditTitle: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        color:"black"
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Elevation for Android shadow
    },
    titleHeader: {
        padding: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
    },
});

export default CastDetailScreen;
