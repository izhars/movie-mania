// DayWeekSwitch.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DayWeekSwitch = ({ selectedIndex, onSwitchChange }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, selectedIndex === 0 && styles.selectedButton]}
                onPress={() => onSwitchChange(0)}
            >
                <Text style={[styles.buttonText, selectedIndex === 0 && styles.selectedButtonText]}>
                    Day
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, selectedIndex === 1 && styles.selectedButton]}
                onPress={() => onSwitchChange(1)}
            >
                <Text style={[styles.buttonText, selectedIndex === 1 && styles.selectedButtonText]}>
                    Week
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 110,
        alignSelf: 'center',
        borderWidth:1,
        borderColor:'lightgray',
        borderRadius:20,
        padding:2
    },
    button: {
        paddingStart: 7,
        paddingEnd:7,
        paddingTop:5,
        paddingBottom:5,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    selectedButton: {
        backgroundColor: 'lightpink',
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
        fontFamily:'Roboto-Regular'
    },
    selectedButtonText: {
        color: '#fff',
    },
});

export default DayWeekSwitch;
