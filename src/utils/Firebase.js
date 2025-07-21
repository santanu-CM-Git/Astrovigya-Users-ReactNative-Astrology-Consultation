import * as firebase from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyAlggVgs0N8zugtKEGFIFftGWc50nFzloA",
    authDomain: "astrovigya-ae294.firebaseapp.com",
    projectId: "astrovigya-ae294",
    storageBucket: "astrovigya-ae294.appspot.com",
    messagingSenderId: "508178411282",
    appId: "1:508178411282:web:5eb476611eda3e30be0dcb",
    measurementId: "G-LE3RJD44FD"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
