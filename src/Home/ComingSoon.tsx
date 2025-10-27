import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ComingSoon = () => {

    return (
        <View style={styles.container}>
            <Ionicons name="hourglass-outline" size={100} color="#a259ff" />
            <Text style={styles.title}>Coming Soon</Text>
            <Text style={styles.subtitle}>We’re working on it…</Text>
        </View>
    );
};

export default ComingSoon;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        color: 'black',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        color: '#aaa',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
    button: {
        marginTop: 40,
        backgroundColor: '#a259ff',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});
