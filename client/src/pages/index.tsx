import { useAuth } from '@/context/authContext';
import { Startup } from '@/components/HomeComponents/StartUp';
import Dashboard from '../components/MainDashboard/Main';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';


export default function Home() {
  const { user } = useAuth();


  return (
    <>
      <Navbar />
      {!user ? (<Startup />) : (<Dashboard />)}
    </>
  );
}

