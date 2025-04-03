
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'individual' | 'organization' | null;
  userEmail: string | null;
  userAadhaar: string | null;
  login: (type: 'email' | 'aadhaar' | 'biometric' | 'organization', credentials: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'individual' | 'organization' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAadhaar, setUserAadhaar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserType = localStorage.getItem('userType') as 'individual' | 'organization' | null;
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserAadhaar = localStorage.getItem('userAadhaar');

    setIsAuthenticated(storedIsAuthenticated);
    setUserType(storedUserType);
    setUserEmail(storedUserEmail);
    setUserAadhaar(storedUserAadhaar);
    setIsLoading(false);
  }, []);

  // Function to check if a user exists
  const checkUserExists = (email: string): boolean => {
    // In a real app, this would be an API call to the database
    // For now, we'll simulate checking localStorage for registered users
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      try {
        const users = JSON.parse(registeredUsers);
        return users.some((user: any) => user.email === email);
      } catch (error) {
        console.error('Error parsing registered users:', error);
        return false;
      }
    }
    return false;
  };

  const login = async (
    type: 'email' | 'aadhaar' | 'biometric' | 'organization', 
    credentials: any
  ): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          if (type === 'email') {
            // Email-based login for individuals
            if (credentials.email && credentials.password) {
              // Check if the user exists in our "database"
              const userExists = checkUserExists(credentials.email);
              
              if (!userExists) {
                toast.error('Email not registered. Please sign up first.');
                setIsLoading(false);
                resolve(false);
                return;
              }
              
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('userType', 'individual');
              localStorage.setItem('userEmail', credentials.email);
              localStorage.setItem('authMethod', 'email');
              
              setIsAuthenticated(true);
              setUserType('individual');
              setUserEmail(credentials.email);
              toast.success('Login successful');
              resolve(true);
            } else {
              toast.error('Invalid email or password');
              resolve(false);
            }
          } else if (type === 'aadhaar') {
            // Aadhaar-based login for individuals
            if (credentials.aadhaar) {
              // In a real app, verify if this Aadhaar is registered
              // For now, we'll simulate this
              
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('userType', 'individual');
              localStorage.setItem('userAadhaar', credentials.aadhaar);
              localStorage.setItem('authMethod', 'aadhaar');
              
              setIsAuthenticated(true);
              setUserType('individual');
              setUserAadhaar(credentials.aadhaar);
              toast.success('Aadhaar verification successful');
              resolve(true);
            } else {
              toast.error('Invalid Aadhaar number');
              resolve(false);
            }
          } else if (type === 'biometric') {
            // Biometric login for individuals
            const storedFingerprints = localStorage.getItem('userFingerprints');
            
            if (storedFingerprints) {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('userType', 'individual');
              localStorage.setItem('authMethod', 'biometric');
              
              // Try to get the user email or Aadhaar from localStorage
              // This simulates matching the fingerprint to a user
              const userEmail = localStorage.getItem('userEmail');
              const userAadhaar = localStorage.getItem('userAadhaar');
              
              if (userEmail) {
                setUserEmail(userEmail);
              }
              
              if (userAadhaar) {
                setUserAadhaar(userAadhaar);
              }
              
              setIsAuthenticated(true);
              setUserType('individual');
              toast.success('Biometric authentication successful');
              resolve(true);
            } else {
              toast.error('Biometric data not found');
              resolve(false);
            }
          } else if (type === 'organization') {
            // Organization login
            if (credentials.orgId && credentials.password) {
              // In a real app, verify if this organization is registered
              
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('userType', 'organization');
              localStorage.setItem('orgId', credentials.orgId);
              localStorage.setItem('authMethod', 'organization');
              
              setIsAuthenticated(true);
              setUserType('organization');
              toast.success('Organization login successful');
              resolve(true);
            } else {
              toast.error('Invalid organization credentials');
              resolve(false);
            }
          } else {
            toast.error('Invalid login method');
            resolve(false);
          }
        } catch (error) {
          console.error('Login error:', error);
          toast.error('An error occurred during login');
          resolve(false);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAadhaar');
    localStorage.removeItem('orgId');
    localStorage.removeItem('authMethod');
    
    setIsAuthenticated(false);
    setUserType(null);
    setUserEmail(null);
    setUserAadhaar(null);
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        userEmail,
        userAadhaar,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
