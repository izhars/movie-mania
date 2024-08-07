import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const SocialIconsForPeople = ({ externalIds }) => {
    const openUrl = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={styles.socialIcons}>
            {externalIds.imdb_id && (
                <TouchableOpacity onPress={() => openUrl(`https://www.imdb.com/name/${externalIds.imdb_id}`)}>
                    <View style={styles.iconBg}>
                        <FontAwesome name="imdb" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            )}
            {externalIds.facebook_id && (
                <TouchableOpacity onPress={() => openUrl(`https://www.facebook.com/${externalIds.facebook_id}`)}>
                    <View style={styles.iconBg}>
                        <Entypo name="facebook" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            )}
            {externalIds.twitter_id && (
                <TouchableOpacity onPress={() => openUrl(`https://twitter.com/${externalIds.twitter_id}`)}>
                    <View style={styles.iconBg}>
                        <FontAwesome name="twitter" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            )}
            {externalIds.instagram_id && (
                <TouchableOpacity onPress={() => openUrl(`https://www.instagram.com/${externalIds.instagram_id}`)}>
                    <View style={styles.iconBg}>
                        <FontAwesome name="instagram" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            )}
            {externalIds.tiktok_id && (
                <TouchableOpacity onPress={() => openUrl(`https://www.tiktok.com/@${externalIds.tiktok_id}`)}>
                    <View style={styles.iconBg}>
                        <MaterialIcons name="tiktok" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            )}
            {externalIds.wikidata_id && (
                <View style={styles.socialIcons}>
                    <View style={styles.line} />
                    <TouchableOpacity onPress={() => openUrl(`https://www.wikidata.org/wiki/${externalIds.wikidata_id}`)}>
                        <View style={styles.iconBg}>
                            <FontAwesome name="globe" size={24} color="#000" />
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    socialIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBg: {
        marginHorizontal: 4,
        padding: 7,
        backgroundColor: '#ddd',
        borderRadius: 10,
    },
    line: {
        height: 50,
        width: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
});

export default SocialIconsForPeople;
