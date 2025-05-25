import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './api/supabaseStorage';

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        theme="dark"
      />
    </div>
  );
} 