import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

const ProfileImage = ({ profilePath }) => {
    const [imageUri, setImageUri] = useState(`https://image.tmdb.org/t/p/w500/${profilePath}`);
    
    const handleImageError = () => {
        setImageUri('https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png');
    };

    return (
        <Image
            source={{ uri: imageUri }}
            style={styles.castProfile}
            resizeMode="contain"
            onError={handleImageError}
        />
    );
};

const styles = StyleSheet.create({

    castProfile: {
        width: 92,
        height: 138,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
    },
});

export default ProfileImage;
