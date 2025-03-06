import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ClientProviders } from './client-providers';
import { Database } from '../types/database';
import { UserMenu } from '@/components/layout/UserMenu';

export const metadata = {
  title: 'FlowState Catalyst',
  description: 'Optimize your workflow with flow state-based task management',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
  }

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content={metadata.viewport} />
        <link rel="icon" href={metadata.icons.icon} />
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body>
        <ClientProviders
          session={
            user
              ? {
                  user: {
                    name: user.user_metadata.name,
                    email: user.email,
                    image: user.user_metadata.avatar_url,
                  },
                  expires: '',
                }
              : null
          }
        >
          {children}
          {user && <UserMenu />}
        </ClientProviders>
      </body>
    </html>
  );
}
