import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

const Cast = ({ castMember, onPress }) => {
  const profileImageUri = castMember.profile_path
      ? `https://image.tmdb.org/t/p/w500${castMember.profile_path}`
      : 'https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png';

  const characterName = castMember.roles && castMember.roles.length > 0
      ? castMember.roles[0].character
      : castMember.character;

  return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
          <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
              resizeMode="cover"
          />
          <Text style={styles.name} ellipsizeMode='tail' numberOfLines={1}>
              {castMember.name}
          </Text>
          <Text style={styles.character} ellipsizeMode='tail' numberOfLines={1}>
              {characterName}
          </Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 100,
  },
  profileImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginBottom: 2,
  },
  character: {
    fontSize: 14,
    color: '#555',
  },
});

export default Cast;
