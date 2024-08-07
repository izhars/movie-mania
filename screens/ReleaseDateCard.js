// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Card, Button } from 'react-native-paper';
// import CountryFlag from 'react-native-country-flag';

// const ReleaseDateCard = ({ releaseInfo }) => {
//     const releaseDate = new Date(releaseInfo.release_date).toLocaleDateString('en-US', {
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric',
//     });

//     const certification = releaseInfo.certification || '-';
//     const releaseType = releaseInfo.type === 3 ? 'Theatrical (limited)' : 'Unknown';

//     return (
//         <Card >
//             <Card.Title
//                 title="Release dates"
//                 left={(props) => <CountryFlag isoCode="IN" size={24} />}
//                 titleStyle={styles.title}
//             />
//             <Card.Content>
//                 <View style={styles.row}>
//                     <View style={styles.column}>
//                         <Text style={styles.label}>Date</Text>
//                         <Text style={styles.value}>{releaseDate}</Text>
//                     </View>
//                     <View style={styles.column}>
//                         <Text style={styles.label}>Certification</Text>
//                         <Text style={styles.value}>{certification}</Text>
//                     </View>
//                     <View style={styles.column}>
//                         <Text style={styles.label}>Type</Text>
//                         <Text style={styles.value}>{releaseType}</Text>
//                     </View>
//                 </View>
//                 <Button mode="outlined" onPress={() => { }} style={styles.button}>
//                     More
//                 </Button>
//             </Card.Content>
//         </Card>
//     );
// };

// const styles = StyleSheet.create({
//     title: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 16,
//     },
//     column: {
//         alignItems: 'center',
//     },
//     label: {
//         fontSize: 14,
//         color: '#555',
//     },
//     value: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginTop: 4,
//     },
//     button: {
//         marginTop: 16,
//         alignSelf: 'center',
//         borderRadius: 20,
//         borderColor: '#0057e7',
//     },
// });

// export default ReleaseDateCard;
