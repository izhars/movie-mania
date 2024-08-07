import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HeaderWithBackButton = ({ title, seasonNumber, airDate, episodeCount }) => {
    const navigation = useNavigation();

    const getYear = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };

    return (
        <View style={styles.titleHeader}>
            <TouchableOpacity 
                style={title ? styles.backButtonTop : styles.backButtonCenter} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                {title ? (
                    <Title style={styles.title}>{title}</Title>
                ) : (
                    <>
                        <Title style={styles.subtitle}>Season {seasonNumber}</Title>
                        <Text style={styles.subtitle}>{getYear(airDate)} • {episodeCount} Episodes</Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backButtonTop: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    backButtonCenter: {
        position: 'absolute',
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
        elevation: 5,
        alignSelf: 'center',
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
});

export default HeaderWithBackButton;
