import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SeasonItem = ({ season, onPress }) => {

const year = new Date(season.air_date).getFullYear();

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500/${season.poster_path}` }}
                    style={styles.poster}
                    resizeMode="cover"
                />
                <Text style={styles.name}>{season.name}</Text>
                <Text style={styles.episodes}>{year}. {season.episode_count} Episodes </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        width: 150,
    },
    poster: {
        width: '100%',
        height: 220,
        borderRadius: 8,
    },
    name: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    episodes: {
        fontSize: 14,
        color: '#888',
    },
});

export default SeasonItem;
