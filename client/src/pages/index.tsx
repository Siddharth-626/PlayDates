import { useAuth } from '@/context/authContext';
import { Startup } from '@/components/common/StartUp';
import Dashboard from '../components/MainDashboard/Main';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';
import { useProfile } from '@/context/profileContext';
import { clearOldAvalability } from '@/utils/Availability/clearOldAvailability';
import { createCourt } from '@/utils/testFunctions/createCourt';
import { createMatch } from '@/utils/testFunctions/createMatch';


export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      {!user ? (<Startup />) : (<Dashboard />)}
    </>
  );
}

