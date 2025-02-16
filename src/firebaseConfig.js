import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import notifee from '@notifee/react-native';

export async function requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('🔹 Permission des notifications accordée');
            await getToken();
        } else {
            console.log('🔸 Permission des notifications refusée');
        }
    } else {
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

export async function createNotificationChannel() {
    if (Platform.OS === 'android') {
        const channelId = 'default_channel_id';
        const channelName = 'Default Channel';
        const channelDescription = 'Default Channel for notifications';

        await notifee.createChannel({
            id: channelId,
            name: channelName,
            description: channelDescription,
            importance: 4,
            sound: 'default',
        });
        console.log('🔔 Canal de notification créé');
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

        if (Platform.OS === 'android') {
            await notifee.displayNotification({
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
                android: {
                    channelId: 'default_channel_id',
                },
            });
        } else {
            Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
        }
    });
}