import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('MainTab');
        }, 3000); // Duration for the splash screen
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('/Users/shariqueizhar/MovieMania/assets/images/logo.png')}
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Set the background color for your splash screen
    },
    image: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain',
    },
});

export default SplashScreen;
