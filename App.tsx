import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native'; // Import SafeAreaView and StyleSheet
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { NetInfoProvider } from './screens/NetInfoContext';  // Import the provider

// Import your screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import CastDetailScreen from './screens/CastDetailScreen';
import TvShowScreen from './screens/TvShowScreen';
import TvDetailScreen from './screens/TvDetailScreen';
import TVSeasonScreen from './screens/TVSeasonScreen';
import ViewAllTvScreen from './screens/ViewAllTvScreen';
import TvCategoryScreen from './screens/TvCategoryScreen';
import SplashScreen from './screens/SplashScreen';
import MovieScreen from './screens/MovieScreen';
import PersonScreen from './screens/PersonScreen';
import CollectionScreen from './screens/CollectionScreen';
import ViewAllSeasons from './screens/ViewAllSeasons';
import TvSeasonCast from './screens/TvSeasonCast';
import EpisodeDetailScreen from './screens/EpisodeDetailScreen';
import ImageViewerScreen from './screens/ImageViewerScreen';
import ViewAllMovieScreen from './screens/ViewAllMovieScreen';
import MoreMoviesScreen from './screens/MoreMoviesScreen';
import ReviewScreen from './screens/ReviewScreen';
import CompanyScreen from './screens/CompanyScreen';
import RandomUserList from './screens/randomUserList';
import UserDetails from './screens/UserDetailPage';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    shifting={true}
    sceneAnimationEnabled={true}
    activeColor="red"
    inactiveColor="#A9A9A9"
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <AntDesign name="home" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Movies"
      component={MovieScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="movie-open-outline" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tv Shows"
      component={TvShowScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Feather name="tv" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Person"
      component={PersonScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="person" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <AntDesign name="search1" size={24} color={color} />
        ),
      }}
    />
     <Tab.Screen
      name="List"
      component={RandomUserList}
      options={{
        tabBarIcon: ({ color }) => (
          <AntDesign name="search1" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NetInfoProvider>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTab"
              component={MainTabScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MovieDetail"
              component={MovieDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetailScreen"
              component={ViewAllMovieScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CastDetail"
              component={CastDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TvDetailScreen"
              component={TvDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TVSeasonScreen"
              component={TVSeasonScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewAllTvScreen"
              component={ViewAllTvScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TvCategoryScreen"
              component={TvCategoryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CollectionScreen"
              component={CollectionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewAllSeasons"
              component={ViewAllSeasons}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TVSeasonCast"
              component={TvSeasonCast}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EpisodeDetailScreen"
              component={EpisodeDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ImageViewer"
              component={ImageViewerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MoreMoviesScreen"
              component={MoreMoviesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ReviewScreen"
              component={ReviewScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CompanyScreen"
              component={CompanyScreen}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="UserDetailPage"
              component={UserDetails}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </NetInfoProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
