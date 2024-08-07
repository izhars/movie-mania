import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoCard = ({ video }) => {
  const handlePlay = (videoKey) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoKey}`;
    Linking.openURL(youtubeUrl);
  };

  const formatPublishedDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-IN', options).replace(' ', ', ');
    }
    return '';
  };

  // Calculate image dimensions based on aspect ratio
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth * 0.6; // Adjust as needed based on your layout
  const imageHeight = imageWidth * (9 / 16); // Assuming a standard 16:9 aspect ratio

  return (
    <View style={styles.container}>
      {video.key ? (
        <Image
          source={{ uri: `https://img.youtube.com/vi/${video.key}/0.jpg` }}
          style={[styles.thumbnail, { width: imageWidth, height: imageHeight }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderImage, { width: imageWidth, height: imageHeight }]}>
          <Text>No Image Available</Text>
        </View>
      )}

      <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(video.key)}>
        <Icon name="youtube-play" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{video.name}</Text>
      <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">
        {formatPublishedDate(video.published_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
  },
  thumbnail: {
    borderRadius: 8,
    marginBottom: 5,
    marginEnd: 10,
    borderWidth:1,
    borderColor:'gray',
  },
  playButton: {
    position: 'absolute',
    top: '25%',  // Adjust this value to move the button up or down
    left: '40%', // Adjust this value to move the button left or right
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    width: 240,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    color: '#666',
    marginTop: 2,
    width: 240,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});

export default VideoCard;
