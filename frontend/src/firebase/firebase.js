// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYJBLUtpVRNvogLy7GU5jvCP0wtYyjgX8",
  authDomain: "compact-nirvana-406005.firebaseapp.com",
  projectId: "compact-nirvana-406005",
  storageBucket: "compact-nirvana-406005.appspot.com",
  messagingSenderId: "70936108003",
  appId: "1:70936108003:web:3ad4dde85b7e7b62b05ed6",
  measurementId: "G-V1Y75ZYRN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
// const analytics = getAnalytics(app);