import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Backdrop = ({ backdrop, backdrops, index }) => {
  const navigation = useNavigation();

  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth * 0.5; 
  const imageHeight = imageWidth / backdrop.aspect_ratio;

  const handleImagePress = () => {
    navigation.navigate('ImageViewer', { images: backdrops, initialIndex: index });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${backdrop.file_path}` }}
          style={[styles.backdropImage, { width: imageWidth, height: imageHeight }]}
          resizeMode="cover" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  backdropImage: {
    borderRadius: 8,
  },
});

export default Backdrop;
