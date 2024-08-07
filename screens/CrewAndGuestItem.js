import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CrewAndGuestItem = ({ person, type }) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w500/${person.profile_path}` : 'https://via.placeholder.com/150' }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.name}>{person.name}</Text>
            <Text style={styles.detail}>
                {type === 'crew' ? person.job : person.character}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        width: 100,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    name: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 12,
        color: '#888',
    },
});

export default CrewAndGuestItem;
