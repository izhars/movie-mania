import Ionicons from 'react-native-vector-icons/Ionicons';
import * as React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Antonio Renders</Text>
        <Text style={styles.profileHandle}>@renders.antonio</Text>
      </View>
      <List.Section>
        <List.Item
          title="My Profile"
          left={() => <Ionicons name="person-outline" size={24} color={colors.primary} />}
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Notification"
          left={() => <Ionicons name="notifications-outline" size={24} color={colors.primary} />}
          onPress={() => navigation.navigate('MovieDetail', { movieId: 651 })}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="History"
          left={() => <Ionicons name="time-outline" size={24} color={colors.primary} />}
          onPress={() => {}}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="My Subscription"
          left={() => <Ionicons name="card-outline" size={24} color={colors.primary} />}
          onPress={() => {}}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Setting"
          left={() => <Ionicons name="settings-outline" size={24} color={colors.primary} />}
          onPress={() => {}}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Help"
          left={() => <Ionicons name="help-circle-outline" size={24} color={colors.primary} />}
          onPress={() => {}}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Logout"
          left={() => <Ionicons name="log-out-outline" size={24} color={colors.primary} />}
          onPress={() => {}}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileHandle: {
    color: 'gray',
    fontSize: 16,
  },
  listItem: {
    backgroundColor: 'lightgray',
    marginVertical: 5,
    paddingStart: 10,
    borderRadius: 10,
  },
  listItemTitle: {
    color: '#ffffff',
  },
});

export default ProfileScreen;
