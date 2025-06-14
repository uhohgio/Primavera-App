
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udxqwihvbhmidocfprxm.supabase.co';
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeHF3aWh2YmhtaWRvY2ZwcnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTMwNDksImV4cCI6MjA2NTQyOTA0OX0.UyjYfVSOrVPKRV4WCs7_NZDCvGkleFneynZBjEJg2gY'

export const supabase = createClient(supabaseUrl, supabaseKey);