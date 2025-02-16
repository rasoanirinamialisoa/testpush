import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { requestUserPermission, notificationListener } from './src/firebaseConfig';

const App = () => {
    useEffect(() => {
        requestUserPermission();
        notificationListener();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Push Notification Firebase</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blueviolet',
    },
    text: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default App;
