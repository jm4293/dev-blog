import { getCurrentUser } from '@/supabase';
import { HeaderClient } from './HeaderClient';

export async function Header() {
  const user = await getCurrentUser();

  return <HeaderClient isLoggedIn={!!user} />;
}
