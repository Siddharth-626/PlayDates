import { useAuth } from '@/context/authContext';
import { Startup } from '@/components/HomeComponents/StartUp';
import Dashboard from '../components/MainDashboard/Main';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Startup has its own header; Dashboard has its own floating sidebar
  return user ? <Dashboard /> : <Startup />;
}
