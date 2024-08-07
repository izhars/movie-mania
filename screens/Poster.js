import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Poster = ({ poster, posters, index }) => {
  const navigation = useNavigation();

  console.log("sdvcuwsyfcvw",posters)

  const handleImagePress = (index) => {
    navigation.navigate('ImageViewer', { images: posters, initialIndex: index });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleImagePress(index)}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w1280${poster.file_path}` }}
          style={[styles.posterImage, { width: 100, height: 140 }]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Poster;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  posterImage: {
    borderRadius: 8,
  },
});
