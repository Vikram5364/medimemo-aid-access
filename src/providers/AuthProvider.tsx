
import { ReactNode } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useSession } from '@/hooks/use-session';
import { useAuthOperations } from '@/hooks/use-auth-operations';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [
    sessionState,
    setIsAuthenticated,
    setUserType,
    setUserEmail,
    setUserAadhaar,
    setIsLoading
  ] = useSession();

  const authOperations = useAuthOperations(
    setIsAuthenticated,
    setUserType,
    setUserEmail,
    setUserAadhaar,
    setIsLoading
  );

  // Return the auth context provider
  return (
    <AuthContext.Provider
      value={{
        ...sessionState,
        ...authOperations
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
