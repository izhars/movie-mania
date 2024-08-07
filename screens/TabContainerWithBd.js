import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, StyleSheet } from 'react-native';
import VideoCard from './VideoCard';
import Poster from './Poster';
import Backdrop from './Backdrop'; // Ensure you have this component created
import Loader from './Loader';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TabContainerWithBd = ({ videos, posters, backdrops, loading }) => {
    const [selectedTabMedia, setSelectedTabMedia] = useState('');

    useEffect(() => {
        if (videos && videos.length > 0) {
            setSelectedTabMedia('Videos');
        } else if (posters && posters.length > 0) {
            setSelectedTabMedia('Posters');
        } else if (backdrops && backdrops.length > 0) {
            setSelectedTabMedia('Backdrops');
        }
    }, [videos, posters, backdrops]);

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
    const renderBackdropItem = ({ item, index }) => <Backdrop backdrop={item} backdrops={backdrops} index={index} />;

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
                {backdrops && backdrops.length > 0 && (
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTabMedia === 'Backdrops' && styles.selectedTabButton]}
                        onPress={() => handleTabPress('Backdrops')}
                    >
                        <Text style={styles.tabText}>Backdrops</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.container}>
                {selectedTabMedia === 'Videos' && videos && videos.length > 0 && (
                    <>
                        <Text style={styles.mediaTitle}>Watch Related Videos</Text>
                        <View style={styles.mediaContainer}>
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
                        <Text style={styles.mediaTitle}>View Posters</Text>
                        <View style={styles.mediaContainer}>
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

                {selectedTabMedia === 'Backdrops' && backdrops && backdrops.length > 0 && (
                    <>
                        <Text style={styles.mediaTitle}>View Backdrops</Text>
                        <View style={styles.mediaContainer}>
                            <FlatList
                                data={backdrops}
                                renderItem={renderBackdropItem}
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
    mediaContainer: {
        flex: 1,
        padding: 5,
        backgroundColor: '#F0F3F8',
    },
    mediaTitle: {
        fontFamily: 'Roboto-Bold',
        padding: 10,
        backgroundColor: '#F0F3F8'
    },
});

export default TabContainerWithBd;
