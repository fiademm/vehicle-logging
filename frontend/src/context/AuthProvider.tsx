import { useState, type ReactNode } from 'react';
import { AuthContext } from './auth';
import api from '../services/api';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

   const login = async (username: string, password: string) => {
       try {
         const response = await api.post('/auth/login', { username, password });
         const { accessToken } = response.data;
         localStorage.setItem('token', accessToken);
         setIsAuthenticated(true);
         navigate('/');
       } catch (error) {
         if (isAxiosError(error)) {
           if (error.response?.status === 500) {
             throw new Error('Invalid password type or server error');
           } else if (error.response?.status === 401) {
             throw new Error('Invalid credentials');
           } else {
             throw new Error('An error occurred during login');
           }
         } else {
            throw new Error('An error occurred during login');
         }
       }
     };
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}