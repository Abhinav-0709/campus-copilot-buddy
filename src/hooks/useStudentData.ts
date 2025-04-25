
import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database, useMockData } from '@/config/firebase';
import { toast } from 'sonner';

export interface StudentData {
  id?: string;
  name: string;
  course: string;
  year: number;
  [key: string]: any;
}

export const useStudentData = () => {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get mock data for fallback
  const mockData = useMockData();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentsRef = ref(database, 'students');
        const snapshot = await get(studentsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setStudentData(Object.values(data));
        } else {
          // If no data in Firebase, use mock data
          console.log('No data available in Firebase, using mock data');
          setStudentData(mockData.students);
          toast.info('Using demo student data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        // If Firebase fails, use mock data
        setStudentData(mockData.students);
        setError('Failed to fetch student data from Firebase. Using demo data instead.');
        toast.error('Failed to connect to Firebase. Using demo student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return { studentData, loading, error };
};
