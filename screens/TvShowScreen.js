import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { BEARER_TOKEN, getTrendingTvUrlByDay, getTrendingTvUrlByWeek, getAiringTodayTvUrl, getOnTheAirTvUrl, getPopularTvUrl, getTopRatedTvUrl } from './config'; // Adjust the path as necessary
import TvItem from './TvItem';
import Loader from './Loader';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DayWeekSwitch from './DayWeekSwitch';
import Icon from 'react-native-vector-icons/Ionicons';

const TvShowScreen = () => {
  const [airingTodayTv, setAiringTodayTv] = useState([]);
  const [onTheAirTv, setOnTheAirTv] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [topRatedTv, setTopRatedTv] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dayTvSeries, setDayTvSeries] = useState([]);
  const [weekTvSeries, setWeekTvSeries] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const trendingTvSeries = selectedIndex === 0 ? dayTvSeries : weekTvSeries;

  useEffect(() => {
    const fetchTvShows = async () => {
      setIsLoading(true);
      try {
        const endpoints = [
          getTrendingTvUrlByDay(),
          getTrendingTvUrlByWeek(),
          getAiringTodayTvUrl(),
          getOnTheAirTvUrl(),
          getPopularTvUrl(),
          getTopRatedTvUrl(),
        ];

        const fetchPromises = endpoints.map((endpoint) =>
          fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${endpoint}`);
            }
            return response.json();
          })
        );

        const [dayData, weekData, airingTodayData, onTheAirData, popularData, topRatedData] = await Promise.all(fetchPromises);

        setDayTvSeries(dayData.results);
        setWeekTvSeries(weekData.results);
        setAiringTodayTv(airingTodayData.results);
        setOnTheAirTv(onTheAirData.results);
        setPopularTv(popularData.results);
        setTopRatedTv(topRatedData.results);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Data: ', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchTvShows();
  }, []);

  const handleSwitchChange = (index) => {
    console.log("the currrent state",index)
    setSelectedIndex(index);
  };

  const navigateToViewAll = (endpoint) => {
    navigation.navigate('ViewAllTvScreen', { endpoint,selectedIndex });
  };

  const renderTvItem = (Component) => ({ item }) => (
    <Component
      item={item}
      onPress={() => navigation.navigate('TvDetailScreen', { id: item.id })}
    />
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.switchContainerButton}>
            <Text style={styles.header}>Trending Movies</Text>
            <View style={styles.switchContainer}>
              <DayWeekSwitch
                selectedIndex={selectedIndex}
                onSwitchChange={handleSwitchChange}
              />
            </View>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll('trending')}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={20} color="#ff8080" />
            </TouchableOpacity>
          </View>
          <FlatList
              horizontal
              data={trendingTvSeries}
              renderItem={renderTvItem(TvItem)}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.scrollView}
            />
          <View style={styles.viewAllContainer}>
            <Text style={styles.header}>Airing Today</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll("Airing Today")}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={20} color="#ff8080" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={airingTodayTv}
            renderItem={renderTvItem(TvItem)}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          />
          <View style={styles.viewAllContainer}>
            <Text style={styles.header}>On The Air</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll("On The Air")}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={20} color="#ff8080" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={onTheAirTv}
            renderItem={renderTvItem(TvItem)}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          />
          <View style={styles.viewAllContainer}>
            <Text style={styles.header}>Popular TV Shows</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll("Popular TV Shows")}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={20} color="#ff8080" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={popularTv}
            renderItem={renderTvItem(TvItem)}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          />
          <View style={styles.viewAllContainer}>
            <Text style={styles.header}>Top Rated TV Shows</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigateToViewAll("Top Rated TV Shows")}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={20} color="#ff8080" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={topRatedTv}
            renderItem={renderTvItem(TvItem)}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default TvShowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
  },
  switchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainerButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainerButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'black',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 16,
    color: '#ff8080',
    marginRight: 5,
  },
  item: {
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
  },
});