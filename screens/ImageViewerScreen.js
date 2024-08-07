import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { useNavigation, useRoute } from '@react-navigation/native';

const ImageViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { images, initialIndex } = route.params;

  const [visible, setVisible] = useState(true);

  if (!images || images.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No images available</Text>
      </View>
    );
  }

  const imageUrls = images.map(poster => ({
    uri: poster.file_path.startsWith('http') ? poster.file_path : `https://image.tmdb.org/t/p/w1280${poster.file_path}`
  }));

  const handleRequestClose = () => {
    setVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ImageViewing
        images={imageUrls}
        imageIndex={initialIndex}
        visible={visible}
        onRequestClose={handleRequestClose}
        FooterComponent={({ imageIndex }) => (
          <View style={styles.footer}>
            <Text style={styles.footerText}>{`${imageIndex + 1} / ${images.length}`}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.cancelButton} onPress={handleRequestClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ImageViewerScreen;
