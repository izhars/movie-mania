import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, BEARER_TOKEN } from './config';
import { Button, TextInput, Headline, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const getRequestToken = async () => {
        const response = await fetch(`${API_BASE_URL}/authentication/token/new`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
        });
        const data = await response.json();
        return data.request_token;
    };

    const authorizeRequestToken = async (requestToken) => {
        const response = await fetch(`${API_BASE_URL}/authentication/token/validate_with_login`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                username,
                password,
                request_token: requestToken,
            }),
        });
        const data = await response.json();
        return data.success;
    };

    const createSession = async (requestToken) => {
        const response = await fetch(`${API_BASE_URL}/authentication/session/new`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ request_token: requestToken }),
        });
        const data = await response.json();
        return data.session_id;
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const requestToken = await getRequestToken();
            const authorized = await authorizeRequestToken(requestToken);

            if (authorized) {
                const sessionId = await createSession(requestToken);
                await AsyncStorage.setItem('sessionId', sessionId);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTab' }],
                });
            } else {
                Alert.alert('Login Failed', 'Invalid credentials, please try again.');
            }
        } catch (error) {
            Alert.alert('Login Error', 'An error occurred during login. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Headline style={styles.headline}>Welcome Back!</Headline>
            <Paragraph style={styles.paragraph}>Please login to continue</Paragraph>
            <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
            />
            <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    headline: {
        textAlign: 'center',
        marginBottom: 16,
    },
    paragraph: {
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 16,
    },
    buttonContent: {
        paddingVertical: 8,
    },
});

export default LoginScreen;
