import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This route specifically handles the OAuth callback code exchange
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL, otherwise default to '/'
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use origin + next path for successful redirection
      // Ensure 'next' path starts with '/'
      const redirectPath = next.startsWith('/') ? next : `/${next}`;
      return NextResponse.redirect(`${origin}${redirectPath}`);
    } else {
       console.error("Error exchanging code for session:", error);
       // Redirect to sign-in page with an error query parameter
       return NextResponse.redirect(`${origin}/auth/signin?error=OAuth callback failed`);
    }
  }

  // Redirect to sign-in page if no code is present (e.g., direct access)
  return NextResponse.redirect(`${origin}/auth/signin?error=Missing OAuth code`);
}

// Other methods (POST, etc.) are not needed for this callback handler.
// Returning 405 Method Not Allowed is standard REST practice.
export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}