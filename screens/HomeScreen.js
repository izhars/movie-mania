import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import { BEARER_TOKEN } from './config';
import Loader from './Loader';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const getWatchProviders = async () => {
  try {
    const response = await fetch('https://api.themoviedb.org/3/watch/providers/tv?language=en-US&watch_region=IN', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch watch providers');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    throw error;
  }
};

const getFreeToWatchTVShows = async (providerId) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?with_watch_providers=${providerId}&watch_region=IN&with_watch_monetization_types=free`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch free to watch TV shows');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching free to watch TV shows:', error);
    throw error;
  }
};

const getFreeToWatchMovies = async (providerId) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_watch_providers=${providerId}&watch_region=IN&with_watch_monetization_types=free`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch free to watch movies');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching free to watch movies:', error);
    throw error;
  }
};

const HomeScreen = () => {
  const [tvShows, setTvShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [watchProviders, setWatchProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProviderLogo, setSelectedProviderLogo] = useState(null);
  const [selectedProviderName, setSelectedProviderName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWatchProviders = async () => {
      setLoading(true);
      try {
        const providers = await getWatchProviders();
        if (providers) {
          setWatchProviders(providers.results);
          const defaultProvider = providers.results.find(provider => provider.provider_name.toLowerCase() === 'jio cinema');
          if (defaultProvider) {
            setProviderId(defaultProvider.provider_id);
          }
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch watch providers');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchProviders();
  }, []);

  useEffect(() => {
    if (providerId) {
      const fetchFreeToWatchContent = async () => {
        setLoading(true);
        try {
          const tvData = await getFreeToWatchTVShows(providerId);
          const movieData = await getFreeToWatchMovies(providerId);

          if (tvData) {
            setTvShows(tvData.results);
          }

          if (movieData) {
            setMovies(movieData.results);
          }
        } catch (error) {
          setError(error.message || 'Failed to fetch free to watch content');
        } finally {
          setLoading(false);
        }
      };

      fetchFreeToWatchContent();
    }
  }, [providerId]);

  const renderTvShowItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('TvDetailScreen', { id: item.id })}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.image}
        />
        <Text style={styles.itemText} ellipsizeMode='tail' numberOfLines={2}>{item.name}</Text>
        <Text style={styles.release_date}>{item.first_air_date}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMovieItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.image}
        />
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.release_date}>{item.release_date}</Text>
      </TouchableOpacity>
    </View>
  );

  const selectProvider = (providerId, providerName, providerLogo) => {
    setProviderId(providerId);
    setSelectedProviderName(providerName);
    setSelectedProviderLogo(providerLogo);
    setModalVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = watchProviders.filter(provider =>
      provider.provider_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProviders(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProviders([]);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.providerButton}>
          <Text>Select Watch Provider</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Watch Provider</Text>

                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search providers"
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                      <Text style={styles.clearSearch}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <FlatList
                  data={searchQuery.length > 0 ? filteredProviders : watchProviders}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectProvider(item.provider_id, item.provider_name, item.logo_path)} style={styles.providerItem}>
                      <View style={styles.providerItemContent}>
                        <Image
                          source={{ uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
                          style={styles.providerLogo}
                        />
                        <Text>{item.provider_name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.provider_id.toString()}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {selectedProviderName && (
          <View style={styles.selectedProviderContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${selectedProviderLogo}` }}
              style={styles.selectedProviderLogo}
            />
            <Text style={styles.selectedProviderText}>{selectedProviderName}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.header}>Free to Watch Movies</Text>
          <FlatList
            data={movies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Free to Watch TV Shows</Text>
          <FlatList
            data={tvShows}
            renderItem={renderTvShowItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  section: {
    padding: 10,
    backgroundColor: "#F0F3F8",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: 'lightgray',
  },
  providerButton: {
    padding: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: 80
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  clearSearch: {
    color: 'blue',
    marginLeft: 10,
  },
  providerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  providerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginRight: 10,
    alignItems: 'center',
    width: 100,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Roboto-Bold'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  selectedProviderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  selectedProviderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedProviderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  release_date: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular'
  }
});

export default HomeScreen;
