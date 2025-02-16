import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('🔹 Permission des notifications accordée');
        await getToken();
    } else {
        console.log('🔸 Permission des notifications refusée');
    }
}

export async function getToken() {
    try {
        const token = await messaging().getToken();
        if (token) {
            console.log('✅ FCM Token:', token);
        } else {
            console.log('❌ Aucun token reçu');
        }
    } catch (error) {
        console.log('❌ Erreur lors de la récupération du token:', error);
    }
}

export function notificationListener() {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('📩 Notification cliquée alors que l’app était en arrière-plan:', remoteMessage);
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('🚀 Notification reçue alors que l’app était fermée:', remoteMessage);
            }
        });

    messaging().onMessage(async remoteMessage => {
        console.log('📨 Notification reçue en foreground:', remoteMessage);
        Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
    });
}
