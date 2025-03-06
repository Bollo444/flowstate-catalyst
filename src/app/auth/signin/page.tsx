'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignIn } from '@/components/auth/SignIn';
import { useSupabase } from '@/lib/supabaseClient';

export default function SignInPage() {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return <SignIn />;
}
