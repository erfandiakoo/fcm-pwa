import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        return window.navigator.serviceWorker
            .getRegistration('/firebase-push-notification-scope')
            .then((serviceWorker) => {
                if (serviceWorker) return serviceWorker;
                return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/firebase-push-notification-scope',
                });
            });
    }
    throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
    getOrRegisterServiceWorker()
        .then((serviceWorkerRegistration) =>
            getToken(messaging, { vapidKey: '', serviceWorkerRegistration }));

export const onForegroundMessage = () =>
    new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));
