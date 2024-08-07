// VoteContainer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const VoteContainer = ({ votePercentage }) => {
  const getVoteColor = (votePercentage) => {
    if (votePercentage >= 70) {
      return '#5cb85c'; // green
    } else if (votePercentage >= 50) {
      return '#f0ad4e'; // yellow
    } else {
      return '#d9534f'; // red
    }
  };

  const strokeDashoffset = 100 - (votePercentage * 113) / 100;

  return (
    <View style={styles.container}>
      <Svg height="40" width="40" viewBox="0 0 40 40">
        <Circle cx="20" cy="20" r="18" stroke="#e0e0e0" strokeWidth="4" fill="none" />
        <Circle
          cx="20"
          cy="20"
          r="18"
          stroke={getVoteColor(votePercentage)}
          strokeWidth="4"
          fill="none"
          strokeDasharray="113"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        <Circle cx="20" cy="20" r="16" fill="#000" />
      </Svg>
      <Text style={styles.voteText}>{votePercentage * 100}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    right: 5,
    alignItems: 'center',
  },
  voteText: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default VoteContainer;
