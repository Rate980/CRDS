// firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

let app;

if (getApps().length === 0) {
  app = initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  });
} else {
  app = getApp(); // すでに初期化されている場合、既存のアプリを取得する
}

const firestore = getFirestore(app);

if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app);
}

export { firestore };
