
import { useAppContext } from '../context/AppContext';

export const useAuth = () => {
  const context = useAppContext();
  return context;
};
