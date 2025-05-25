  var firebaseConfig = {
    apiKey: "AIzaSyCNj6OkH4XVhDATRwp3o_lbpNxMH8RDNak",
    authDomain: "crowdtesting-platform.firebaseapp.com",
    projectId: "crowdtesting-platform",
    storageBucket: "crowdtesting-platform.firebasestorage.app",
    messagingSenderId: "657237479454",
    appId: "1:657237479454:web:d1cd50757f91d6dce89e0f",
    measurementId: "G-HWXH6G6CH0"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
