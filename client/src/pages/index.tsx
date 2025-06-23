import { useAuth } from '@/context/authContext';
import { Startup } from '@/components/common/StartUp';
import Dashboard from '../components/MainDashboard/Main';

export default function Home() {
  const {user} = useAuth();
  return(
    <>
      {!user ? (<Startup />):(<Dashboard />)}
    </>
  );
}

