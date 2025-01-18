import { useState, useEffect } from 'react';
import { Home } from '../../types/Home';
import { Member } from '../../types/Member';

// Temporary dummy data - replace with actual API call
const DUMMY_DATA: Home[] = [
  {
    name: "Gaming Platform Web & Mobile App",
    date_created: "June 18, 2022",
    tasks: 16,
    links: 9,
    progress: 78,
    property_users: [
      {
        id: "1",
        first_name: "Kholood",
        last_name: null,
        email: "kholood@tanseeq.pro",
        avatar: null,
        status: "active"
      },
      {
        id: "2",
        first_name: "Ahmed",
        last_name: "Ali",
        email: "ahmed@tanseeq.pro",
        avatar: null,
        status: "active"
      }
    ]
  },
  {
    name: "Mobile Development Project",
    date_created: "July 20, 2022",
    tasks: 24,
    links: 12,
    progress: 65,
    property_users: [
      {
        id: "3",
        first_name: "Sara",
        last_name: "Mohammed",
        email: "sara@tanseeq.pro",
        avatar: null,
        status: "active"
      }
    ]
  }
];

export const useHomes = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('api/homes');
        // const data = await response.json();
        setHomes(DUMMY_DATA);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch homes');
        setIsLoading(false);
      }
    };

    fetchHomes();
  }, []);

  return {
    homes,
    isLoading,
    error
  };
};
