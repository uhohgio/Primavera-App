import { supabase } from "./supabaseClient";
await supabase
  .storage
  .from('tenant-files')
  .remove(['9/1750194711509_Cover_Letter_DoorDash.pdf']);
