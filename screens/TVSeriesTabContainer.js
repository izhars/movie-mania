import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, StyleSheet } from 'react-native';
import VideoCard from './VideoCard';
import Poster from './Poster';
import Loader from './Loader';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TVSeriesTabContainer = ({ videos, posters, loading }) => {
    const [selectedTabMedia, setSelectedTabMedia] = useState('');

    useEffect(() => {
        if (videos && videos.length > 0) {
            setSelectedTabMedia('Videos');
        } else if (posters && posters.length > 0) {
            setSelectedTabMedia('Posters');
        }
    }, [videos, posters]);

    const handleTabPress = (tab) => {
        const customAnimation = {
            duration: 300,
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        };

        LayoutAnimation.configureNext(customAnimation);
        setSelectedTabMedia(tab);
    };

    const renderVideoItem = ({ item }) => <VideoCard video={item} />;
    const renderPosterItem = ({ item, index }) => <Poster poster={item} posters={posters} index={index} />;

    if (loading) {
        return <Loader />;
    }

    return (
        <View style={styles.section}>
            <View style={styles.tabContainer}>
                {videos && videos.length > 0 && (
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTabMedia === 'Videos' && styles.selectedTabButton]}
                        onPress={() => handleTabPress('Videos')}
                    >
                        <Text style={styles.tabText}>Videos</Text>
                    </TouchableOpacity>
                )}
                {posters && posters.length > 0 && (
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTabMedia === 'Posters' && styles.selectedTabButton]}
                        onPress={() => handleTabPress('Posters')}
                    >
                        <Text style={styles.tabText}>Posters</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.container}>
                {selectedTabMedia === 'Videos' && videos && videos.length > 0 && (
                    <>
                        <Text style={styles.videoTitle}>Watch Related Videos</Text>
                        <View style={styles.vidContainer}>
                            <FlatList
                                data={videos}
                                renderItem={renderVideoItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </>
                )}

                {selectedTabMedia === 'Posters' && posters && posters.length > 0 && (
                    <>
                        <Text style={styles.videoTitle}>View Posters</Text>
                        <View style={styles.vidContainer}>
                            <FlatList
                                data={posters}
                                renderItem={renderPosterItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        padding: 10,
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
    videoTitle: {
        fontFamily: 'Roboto-Bold',
        padding: 10,
        backgroundColor: '#F0F3F8'
    },
});

export default TVSeriesTabContainer;
