import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import HeaderWithBackButton from './HeaderWithBackButton';

const CrewList = ({ crew = [], cast = [] }) => {
    const navigation = useNavigation();

    const groupedCrew = crew.reduce((acc, member) => {
        if (!acc[member.department]) {
            acc[member.department] = [];
        }
        acc[member.department].push(member);
        return acc;
    }, {});

    return (
        <View>
            <HeaderWithBackButton title="Tv Series Cast" />
            <ScrollView>
                <View style={styles.container}>
                    {cast.length > 0 && (
                        <View>
                            <View style={styles.mainHeader}>
                                <Text style={styles.castText}>Series Cast ({cast.length})</Text>
                            </View>
                            <View style={styles.membersContainer}>
                                {cast.map((member) => (
                                    <View key={member.credit_id} style={styles.memberContainer}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('CastDetail', { personId: member.id })}
                                        >
                                            {member.profile_path ? (
                                                <Image
                                                    source={{ uri: `https://image.tmdb.org/t/p/w500${member.profile_path}` }}
                                                    style={styles.profileImage}
                                                />
                                            ) : (
                                                <Image
                                                    source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
                                                    style={styles.profileImage}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        <Text style={styles.memberCharacter}>{member.character}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                    <View style={styles.mainHeader}>
                        <Text style={styles.castText}>Series Crew ({crew.length})</Text>
                    </View>
                    {Object.keys(groupedCrew).map((department, index) => (
                        <View key={index} style={styles.departmentContainer}>
                            <View style={styles.box}>
                                <Text style={styles.departmentTitle}>{department}</Text>
                            </View>
                            <View style={styles.membersContainer}>
                                {groupedCrew[department].map((member) => (
                                    <View key={member.credit_id} style={styles.memberContainer}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('CastDetail', { personId: member.id })}
                                        >
                                            {member.profile_path ? (
                                                <Image
                                                    source={{ uri: `https://image.tmdb.org/t/p/w500${member.profile_path}` }}
                                                    style={styles.profileImage}
                                                />
                                            ) : (
                                                <Image
                                                    source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
                                                    style={styles.profileImage}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainHeader: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignSelf: 'center'
    },
    castText: {
        fontFamily: "Roboto-Bold",
        fontSize: 16,
    },
    box: {
        flexDirection: 'row',
        padding: 8, 
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'lightgray',
        alignSelf: 'flex-start', 
        margin: 10
    },
    departmentTitle: {
        fontFamily: "Roboto-Medium",
        color: '#135796',
        fontSize: 15,
    },
    membersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    memberContainer: {
        alignItems: 'center',
        marginBottom: 15,
        width: "33%",
    },
    profileImage: {
        width: 100,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    memberName: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        color: 'black',
    },
    memberCharacter: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default CrewList;
