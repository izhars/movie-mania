import React, { useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CarousalData = ({ popular }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderCarouselItem = (item, index) => (
    <View style={styles.carouselItemContainer} key={index}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
        style={styles.carouselItemImage}
      />
    </View>
  );

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, screenWidth);
    return (
      <View style={styles.dotsContainer}>
        {popular.map((_, i) => {
          const opacity = dotPosition.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {popular.map((item, index) => renderCarouselItem(item, index))}
      </Animated.ScrollView>
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  carouselItemContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItemImage: {
    width: screenWidth * 0.9,
    height: 200,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#595959',
    marginHorizontal: 4,
  },
});

export default CarousalData;
