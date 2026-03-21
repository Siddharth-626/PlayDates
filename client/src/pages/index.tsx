import { useAuth } from '@/context/authContext';
import { Startup } from '@/components/HomeComponents/StartUp';
import Dashboard from '../components/MainDashboard/Main';
import Navbar from '@/components/Navbar';


export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Navbar />
      {!user ? (<Startup />) : (<Dashboard />)}
    </>
  );
}
