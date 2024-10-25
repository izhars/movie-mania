import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Title } from 'react-native-paper';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.22; // Adjust as needed based on your design

const WatchProvider = ({ providers }) => {
  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return <Text style={styles.text}>No providers available for India.</Text>;
  }

  const handleProviderPress = (provider) => {
    const providerUrls = {
      'netflix': 'https://www.netflix.com',
      'jio cinema': 'https://www.jiocinema.com',
      'appletv': 'https://www.apple.com/apple-tv/',
      'zee 5': 'https://www.zee5.com',
      'google play movies': 'https://play.google.com/store/movies',
      'youtube': 'https://www.youtube.com',
      'tata play': 'https://www.tataplay.com',
      'amazon video': 'https://www.primevideo.com',
      'hotstar': 'https://www.hotstar.com',
    };

    const url = providerUrls[provider.provider_name.toLowerCase()];
    if (url) {
      Linking.openURL(url);
    } else {
      const providerName = provider.provider_name.toLowerCase();
      Linking.canOpenURL(providerName)
        .then((supported) => {
          if (supported) {
            Linking.openURL(providerName);
          } else {
            Linking.openURL(`https://www.${providerName}.com`);
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  };

  return (
    <View style={styles.container}>
      {providers.flatrate && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Stream</Title>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers.flatrate}
            keyExtractor={(provider) => provider.provider_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.provider}
                onPress={() => handleProviderPress(item)}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
                  style={styles.logo}
                />
                {/* <Text style={[styles.providerName, { width: ITEM_WIDTH }]} numberOfLines={2} ellipsizeMode="tail">
                  {item.provider_name}
                </Text> */}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {providers.rent && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Rent</Title>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers.rent}
            keyExtractor={(provider) => provider.provider_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.provider}
                onPress={() => handleProviderPress(item)}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
                  style={styles.logo}
                />
                {/* <Text style={[styles.providerName, { width: ITEM_WIDTH }]} numberOfLines={2} ellipsizeMode="tail">
                  {item.provider_name}
                </Text> */}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {providers.buy && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Buy</Title>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers.buy}
            keyExtractor={(provider) => provider.provider_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.provider}
                onPress={() => handleProviderPress(item)}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
                  style={styles.logo}
                />
                {/* <Text style={[styles.providerName, { width: ITEM_WIDTH }]} numberOfLines={2} ellipsizeMode="tail">
                  {item.provider_name}
                </Text> */}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  section: {
    marginBottom: 5,
    flexDirection:'row'
  },
  text:{
    fontSize:15,
    fontFamily:'Roboto-Regular',
    color:'gray'
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 5,
    width:80
  },
  provider: {
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginEnd:10
  },
  providerName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto-Light',
  },
});

export default WatchProvider;
