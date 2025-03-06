import { Session } from 'next-auth';
import { SupabaseSession } from '../types/supabase';

interface ClientProvidersProps {
  children: React.ReactNode;
  session: Session | null | undefined;
}

interface SupabaseClientProvidersProps {
  children: React.ReactNode;
  session: SupabaseSession | null;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children, session }) => {
  return <>{children}</>;
};

const SupabaseClientProviders: React.FC<SupabaseClientProvidersProps> = ({ children, session }) => {
  return <>{children}</>;
};

export { ClientProviders, SupabaseClientProviders };
