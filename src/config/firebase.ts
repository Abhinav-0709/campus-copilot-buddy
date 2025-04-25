
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Use import.meta.env instead of process.env for Vite projects
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForTesting123456",
  authDomain: "demo-project.firebaseapp.com",
  databaseURL: "https://demo-project-default-rtdb.firebaseio.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Mock database for testing if not connected to Firebase
export const useMockData = () => {
  return {
    students: [
      { id: '1', name: 'Priya Sharma', course: 'Computer Science', year: 3 },
      { id: '2', name: 'Raj Kumar', course: 'Mechanical Engineering', year: 2 },
      { id: '3', name: 'Ananya Patel', course: 'Electrical Engineering', year: 4 },
      { id: '4', name: 'Vikram Singh', course: 'Civil Engineering', year: 1 },
      { id: '5', name: 'Meera Gupta', course: 'Computer Science', year: 3 }
    ]
  };
};
