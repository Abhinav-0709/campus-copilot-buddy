
import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/config/firebase';

export interface StudentData {
  name: string;
  course: string;
  year: number;
  [key: string]: any;
}

export const useStudentData = () => {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentsRef = ref(database, 'students');
        const snapshot = await get(studentsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setStudentData(Object.values(data));
        } else {
          setStudentData([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return { studentData, loading, error };
};
