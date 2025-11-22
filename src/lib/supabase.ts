import { createClient } from '@/utils/supabase/client';

// Export the browser client for use in client components
export const supabase = createClient();
