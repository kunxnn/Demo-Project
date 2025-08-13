import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxvzNiKl9S8CiEBaBnoNyllAHSxmGEKak",
  authDomain: "test-login-96b31.firebaseapp.com",
  projectId: "test-login-96b31",
  appId: "1:409895877566:web:d42f7fe3cac0372ebe17ef",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCxvzNiKl9S8CiEBaBnoNyllAHSxmGEKak",
//   authDomain: "test-login-96b31.firebaseapp.com",
//   projectId: "test-login-96b31",
//   storageBucket: "test-login-96b31.firebasestorage.app",
//   messagingSenderId: "409895877566",
//   appId: "1:409895877566:web:d42f7fe3cac0372ebe17ef",
//   measurementId: "G-6CFBX2HWY2"
// };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);