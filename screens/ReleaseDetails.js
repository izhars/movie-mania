import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
};

const releaseTypeMapping = {
    1: 'Premiere',
    2: 'Theatrical (limited)',
    3: 'Theatrical',
    4: 'Digital',
    5: 'Physical',
    6: 'TV',
};

const ReleaseDetails = ({ releaseData }) => {
    const details = [
        { label: 'Date', value: formatDate(releaseData.release_date) },
        { label: 'Certification', value: releaseData.certification || 'N/A' },
        { label: 'Type', value: releaseTypeMapping[releaseData.type] || 'Other' },
        { label: 'Language', value: releaseData.iso_639_1 || 'N/A' },
        { label: 'Note', value: releaseData.note || 'No additional notes' }
    ];

    return (
        <View style={styles.releaseDetails}>
            {details.map((detail, index) => (
                <View
                    key={index}
                    style={[
                        styles.save,
                        (index % 2 === 0 && index !== details.length - 1) ? styles.rightBorder : null,
                        (index < details.length - 2) ? styles.bottomBorder : null
                    ]}
                >
                    <Text style={styles.releaseLabel}>{detail.label}: </Text>
                    <Text style={styles.value}>{detail.value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    releaseDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    save: {
        width: '50%', 
        alignItems: 'center',
        paddingVertical: 10,
    },
    rightBorder: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    releaseLabel: {
        fontSize: 15,
        fontFamily: 'Roboto-Bold',
        color:'black'
    },
    value: {
        fontFamily: 'Roboto-Regular',
        color:'gray'
    }
});

export default ReleaseDetails;
