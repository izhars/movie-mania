import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

const RatingCircleSmall = ({ rating }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rating / 10) * circumference;

  const getGradientStops = (votePercentage) => {
    if (votePercentage >= 70) {
      return ['#5cb85c', '#bee3be']; 
    } else if (votePercentage >= 50) {
      return ['#f0ad4e', '#f9deb8']; 
    }else if (votePercentage >= 50) {
      return ['#f0ad4e', '#f9deb8']; 
    } else {
      return ['#d9534f', '#f0bab9'];
    }
  };

  const [startColor, endColor] = getGradientStops(rating * 10);

  return (
    <View style={styles.ratingContainer}>
      <Svg height="40" width="40" viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={startColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={endColor} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke="white"
          strokeWidth="14"
          fill="#000"
        />
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke="url(#grad)"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        <SvgText
          x="40"
          y="40"
          textAnchor="middle"
          dy="0.3em"
          fontSize="18"
          fill="#fff"
        >
          {rating}
        </SvgText>
      </Svg>
      <View style={styles.voteContainer}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
});

export default RatingCircleSmall;
